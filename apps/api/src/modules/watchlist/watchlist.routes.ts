import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../db/prisma.js";
import { asyncHandler } from "../../http/asyncHandler.js";
import { AppError } from "../../http/errors.js";
import { serializeAuction } from "../../http/serializers.js";
import { requireAuth } from "../../middleware/auth.js";

export const watchlistRouter = Router();

watchlistRouter.use(requireAuth);

watchlistRouter.get("/", asyncHandler(async (req, res) => {
  const items = await prisma.watchlistItem.findMany({
    where: { userId: req.user!.id },
    include: { auction: { include: { bike: true, bids: { orderBy: { createdAt: "desc" }, take: 5, include: { user: { select: { id: true, name: true } } } } } } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ watchlist: items.map((item) => serializeAuction(item.auction)) });
}));

watchlistRouter.get("/:auctionId", asyncHandler(async (req, res) => {
  const item = await prisma.watchlistItem.findUnique({
    where: { userId_auctionId: { userId: req.user!.id, auctionId: String(req.params.auctionId) } }
  });
  res.json({ watching: Boolean(item) });
}));

watchlistRouter.post("/:auctionId", asyncHandler(async (req, res) => {
  const auction = await prisma.auction.findUnique({ where: { id: String(req.params.auctionId) } });
  if (!auction) throw new AppError(404, "Auction not found");
  await prisma.watchlistItem.upsert({
    where: { userId_auctionId: { userId: req.user!.id, auctionId: auction.id } },
    update: {},
    create: { userId: req.user!.id, auctionId: auction.id }
  });
  res.status(201).json({ watching: true });
}));

watchlistRouter.delete("/:auctionId", asyncHandler(async (req, res) => {
  await prisma.watchlistItem.delete({
    where: { userId_auctionId: { userId: req.user!.id, auctionId: String(req.params.auctionId) } }
  }).catch(() => null);
  res.status(204).send();
}));

const requestSchema = z.object({
  preferredDate: z.coerce.date(),
  type: z.enum(["INSPECTION", "TEST_RIDE", "VIDEO_CALL"]).default("INSPECTION"),
  note: z.string().max(500).optional().nullable()
});

watchlistRouter.post("/:auctionId/requests", asyncHandler(async (req, res) => {
  const input = requestSchema.parse(req.body);
  const auction = await prisma.auction.findUnique({ where: { id: String(req.params.auctionId) } });
  if (!auction) throw new AppError(404, "Auction not found");
  const request = await prisma.inspectionRequest.create({
    data: { ...input, userId: req.user!.id, auctionId: auction.id }
  });
  res.status(201).json({ request });
}));
