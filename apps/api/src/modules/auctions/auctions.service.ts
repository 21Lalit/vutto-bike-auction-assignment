import type { Server } from "socket.io";
import { prisma } from "../../db/prisma.js";
import { AppError } from "../../http/errors.js";
import { assertValidBid, getEffectiveStatus, pickWinner } from "./auctionRules.js";

export async function listAuctions(query: Record<string, unknown>) {
  const where: any = {};
  if (query.status) where.status = String(query.status).toUpperCase();
  if (query.brand) where.bike = { ...(where.bike ?? {}), brand: { contains: String(query.brand) } };
  if (query.location) where.bike = { ...(where.bike ?? {}), location: { contains: String(query.location) } };
  if (query.keyword) {
    const keyword = String(query.keyword);
    where.OR = [
      { bike: { title: { contains: keyword } } },
      { bike: { brand: { contains: keyword } } },
      { bike: { model: { contains: keyword } } }
    ];
  }
  if (query.minPrice || query.maxPrice) {
    where.currentBid = {};
    if (query.minPrice) where.currentBid.gte = Number(query.minPrice);
    if (query.maxPrice) where.currentBid.lte = Number(query.maxPrice);
  }
  return prisma.auction.findMany({
    where,
    include: { bike: true, bids: { orderBy: { createdAt: "desc" }, take: 5, include: { user: { select: { name: true } } } } },
    orderBy: [{ status: "asc" }, { endTime: "asc" }]
  });
}

export async function getAuction(id: string) {
  const auction = await prisma.auction.findUnique({
    where: { id },
    include: { bike: true, winner: { select: { id: true, name: true } }, bids: { orderBy: { createdAt: "desc" }, include: { user: { select: { id: true, name: true } } } } }
  });
  if (!auction) throw new AppError(404, "Auction not found");
  return auction;
}

export async function placeBid(auctionId: string, userId: string, amount: number, io?: Server) {
  const result = await prisma.$transaction(async (tx) => {
    const auction = await tx.auction.findUnique({ where: { id: auctionId }, include: { bike: true } });
    if (!auction) throw new AppError(404, "Auction not found");
    try {
      assertValidBid({
        status: asAuctionStatus(auction.status),
        startTime: auction.startTime,
        endTime: auction.endTime,
        basePrice: auction.bike.basePrice,
        currentBid: auction.currentBid,
        minimumIncrement: auction.minimumIncrement,
        amount
      });
    } catch (err) {
      throw new AppError(400, err instanceof Error ? err.message : "Invalid bid");
    }
    const bid = await tx.bid.create({ data: { auctionId, userId, amount }, include: { user: { select: { id: true, name: true } } } });
    const updated = await tx.auction.update({ where: { id: auctionId }, data: { currentBid: amount, status: "LIVE" } });
    return { bid, auction: updated };
  });
  io?.to(`auction:${auctionId}`).emit("bid:new", result);
  return result;
}

export async function syncAuctionLifecycle(io?: Server) {
  const auctions = await prisma.auction.findMany({
    where: { status: { in: ["SCHEDULED", "LIVE"] } },
    include: { bike: true, bids: true }
  });
  for (const auction of auctions) {
    const next = getEffectiveStatus(asAuctionStatus(auction.status), auction.startTime, auction.endTime);
    if (next === auction.status) continue;
    const data: any = { status: next };
    if (next === "ENDED") {
      data.endedAt = new Date();
      data.winnerId = pickWinner(auction.bids, auction.bike.reservePrice);
    }
    const updated = await prisma.auction.update({ where: { id: auction.id }, data });
    io?.to(`auction:${auction.id}`).emit("auction:updated", updated);
  }
}

function asAuctionStatus(status: string) {
  if (["DRAFT", "SCHEDULED", "LIVE", "ENDED", "CANCELLED"].includes(status)) return status as "DRAFT" | "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED";
  return "DRAFT";
}
