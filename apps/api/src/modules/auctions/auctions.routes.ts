import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../db/prisma.js";
import { asyncHandler } from "../../http/asyncHandler.js";
import { AppError } from "../../http/errors.js";
import { serializeAuction } from "../../http/serializers.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";
import { getAuction, listAuctions, placeBid, syncAuctionLifecycle } from "./auctions.service.js";

export const auctionsRouter = Router();

const auctionSchema = z.object({
  bikeId: z.string().min(1),
  status: z.enum(["DRAFT", "SCHEDULED", "LIVE", "ENDED", "CANCELLED"]).default("DRAFT"),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  minimumIncrement: z.number().int().positive().default(100)
}).refine((v) => v.endTime > v.startTime, "End time must be after start time");

auctionsRouter.get("/", asyncHandler(async (req, res) => {
  await syncAuctionLifecycle(req.app.get("io"));
  const auctions = await listAuctions(req.query);
  res.json({ auctions: auctions.map(serializeAuction) });
}));

auctionsRouter.get("/:id", asyncHandler(async (req, res) => {
  await syncAuctionLifecycle(req.app.get("io"));
  res.json({ auction: serializeAuction(await getAuction(String(req.params.id))) });
}));

auctionsRouter.post("/", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const input = auctionSchema.parse(req.body);
  const auction = await prisma.auction.create({ data: input, include: { bike: true, bids: true } });
  res.status(201).json({ auction: serializeAuction(auction) });
}));

auctionsRouter.put("/:id", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const input = auctionSchema.parse(req.body);
  const auction = await prisma.auction.update({ where: { id: String(req.params.id) }, data: input, include: { bike: true, bids: true } }).catch(() => null);
  if (!auction) throw new AppError(404, "Auction not found");
  req.app.get("io").to(`auction:${auction.id}`).emit("auction:updated", auction);
  res.json({ auction: serializeAuction(auction) });
}));

auctionsRouter.post("/:id/:action(start|end|cancel)", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const action = String(req.params.action);
  const status = action === "start" ? "LIVE" : action === "end" ? "ENDED" : "CANCELLED";
  const auction = await getAuction(String(req.params.id));
  const winnerId = status === "ENDED" ? await winnerForAuction(String(req.params.id)) : null;
  const updated = await prisma.auction.update({
    where: { id: String(req.params.id) },
    data: { status, endedAt: status === "ENDED" ? new Date() : auction.endedAt, winnerId }
  });
  req.app.get("io").to(`auction:${updated.id}`).emit("auction:updated", updated);
  res.json({ auction: updated });
}));

auctionsRouter.delete("/:id", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  await prisma.auction.delete({ where: { id: String(req.params.id) } }).catch(() => {
    throw new AppError(404, "Auction not found");
  });
  res.status(204).send();
}));

auctionsRouter.post("/:id/bids", requireAuth, asyncHandler(async (req, res) => {
  const { amount } = z.object({ amount: z.number().int().positive() }).parse(req.body);
  const bid = await placeBid(String(req.params.id), req.user!.id, amount, req.app.get("io"));
  res.status(201).json(bid);
}));

async function winnerForAuction(auctionId: string) {
  const auction = await prisma.auction.findUnique({ where: { id: auctionId }, include: { bike: true, bids: true } });
  if (!auction) return null;
  const { pickWinner } = await import("./auctionRules.js");
  return pickWinner(auction.bids, auction.bike.reservePrice);
}
