import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../db/prisma.js";
import { asyncHandler } from "../../http/asyncHandler.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";

export const sellRouter = Router();

const leadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8).max(20),
  city: z.string().min(2),
  brand: z.string().min(2),
  model: z.string().min(1),
  year: z.number().int().min(1980).max(new Date().getFullYear() + 1),
  expectedPrice: z.number().int().positive().optional().nullable(),
  wantsPickup: z.boolean().default(true),
  notes: z.string().max(500).optional().nullable()
});

sellRouter.post("/leads", asyncHandler(async (req, res) => {
  const input = leadSchema.parse(req.body);
  const lead = await prisma.sellerLead.create({ data: input });
  res.status(201).json({ lead });
}));

sellRouter.get("/leads", requireAuth, requireAdmin, asyncHandler(async (_req, res) => {
  const leads = await prisma.sellerLead.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ leads });
}));

sellRouter.patch("/leads/:id", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { status } = z.object({ status: z.enum(["NEW", "CONTACTED", "APPRAISED", "CONVERTED", "CLOSED"]) }).parse(req.body);
  const lead = await prisma.sellerLead.update({
    where: { id: String(req.params.id) },
    data: { status }
  });
  res.json({ lead });
}));
