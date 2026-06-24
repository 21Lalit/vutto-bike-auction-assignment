import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../db/prisma.js";
import { asyncHandler } from "../../http/asyncHandler.js";
import { AppError } from "../../http/errors.js";
import { serializeAuction } from "../../http/serializers.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";

export const requestsRouter = Router();

requestsRouter.get("/", requireAuth, requireAdmin, asyncHandler(async (_req, res) => {
  const requests = await prisma.inspectionRequest.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      auction: { include: { bike: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  res.json({ requests: requests.map((request) => ({ ...request, auction: serializeAuction(request.auction) })) });
}));

requestsRouter.get("/me", requireAuth, asyncHandler(async (req, res) => {
  const requests = await prisma.inspectionRequest.findMany({
    where: { userId: req.user!.id },
    include: { auction: { include: { bike: true } } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ requests: requests.map((request) => ({ ...request, auction: serializeAuction(request.auction) })) });
}));

requestsRouter.patch("/:id", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { status } = z.object({ status: z.enum(["REQUESTED", "CONFIRMED", "COMPLETED", "CANCELLED"]) }).parse(req.body);
  const request = await prisma.inspectionRequest.update({
    where: { id: String(req.params.id) },
    data: { status },
    include: { user: { select: { id: true, name: true, email: true } }, auction: { include: { bike: true } } }
  }).catch(() => null);
  if (!request) throw new AppError(404, "Request not found");
  res.json({ request: { ...request, auction: serializeAuction(request.auction) } });
}));
