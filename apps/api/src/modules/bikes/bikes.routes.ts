import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../db/prisma.js";
import { asyncHandler } from "../../http/asyncHandler.js";
import { AppError } from "../../http/errors.js";
import { serializeBike } from "../../http/serializers.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";

export const bikesRouter = Router();

const bikeSchema = z.object({
  title: z.string().min(3),
  brand: z.string().min(2),
  model: z.string().min(1),
  year: z.number().int().min(1950).max(new Date().getFullYear() + 1),
  mileage: z.number().int().min(0),
  condition: z.enum(["EXCELLENT", "GOOD", "FAIR", "PROJECT"]),
  location: z.string().min(2),
  photos: z.array(z.string().url()).min(1),
  description: z.string().min(20),
  details: z.record(z.unknown()).optional().nullable(),
  basePrice: z.number().int().positive(),
  reservePrice: z.number().int().positive().optional().nullable()
});

bikesRouter.get("/", asyncHandler(async (_req, res) => {
  const bikes = await prisma.bike.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ bikes: bikes.map(serializeBike) });
}));

bikesRouter.post("/", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const input = bikeSchema.parse(req.body);
  const bike = await prisma.bike.create({ data: { ...input, photos: JSON.stringify(input.photos), details: input.details ? JSON.stringify(input.details) : null } });
  res.status(201).json({ bike: serializeBike(bike) });
}));

bikesRouter.put("/:id", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const input = bikeSchema.parse(req.body);
  const bike = await prisma.bike.update({
    where: { id: String(req.params.id) },
    data: { ...input, photos: JSON.stringify(input.photos), details: input.details ? JSON.stringify(input.details) : null }
  }).catch(() => null);
  if (!bike) throw new AppError(404, "Bike not found");
  res.json({ bike: serializeBike(bike) });
}));

bikesRouter.delete("/:id", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  await prisma.bike.delete({ where: { id: String(req.params.id) } }).catch(() => {
    throw new AppError(404, "Bike not found");
  });
  res.status(204).send();
}));
