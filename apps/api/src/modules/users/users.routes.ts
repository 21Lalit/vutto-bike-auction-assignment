import { Router } from "express";
import { prisma } from "../../db/prisma.js";
import { asyncHandler } from "../../http/asyncHandler.js";
import { serializeAuction } from "../../http/serializers.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";

export const usersRouter = Router();

usersRouter.get("/", requireAuth, requireAdmin, asyncHandler(async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" }
  });
  res.json({ users });
}));

usersRouter.get("/me/auctions", requireAuth, asyncHandler(async (req, res) => {
  const bids = await prisma.bid.findMany({
    where: { userId: req.user!.id },
    include: { auction: { include: { bike: true, winner: { select: { id: true, name: true } } } } },
    orderBy: { createdAt: "desc" }
  });
  const unique = new Map(bids.map((bid) => [bid.auctionId, bid.auction]));
  const auctions = [...unique.values()].map(serializeAuction);
  res.json({
    active: auctions.filter((a) => ["SCHEDULED", "LIVE"].includes(a.status)),
    won: auctions.filter((a) => a.status === "ENDED" && a.winnerId === req.user!.id),
    lost: auctions.filter((a) => a.status === "ENDED" && a.winnerId !== req.user!.id)
  });
}));
