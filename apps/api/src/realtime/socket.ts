import type { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { placeBid } from "../modules/auctions/auctions.service.js";
import type { AuthUser } from "../middleware/auth.js";

const socketBidSchema = z.object({
  auctionId: z.string().min(1),
  amount: z.number().int().positive(),
  token: z.string().min(1)
});

export function registerSocket(io: Server) {
  io.on("connection", (socket) => {
    socket.on("auction:join", (auctionId: string) => socket.join(`auction:${auctionId}`));
    socket.on("auction:leave", (auctionId: string) => socket.leave(`auction:${auctionId}`));
    socket.on("bid:place", async (payload, ack) => {
      try {
        const { auctionId, amount, token } = socketBidSchema.parse(payload);
        const user = jwt.verify(token, env.JWT_SECRET) as AuthUser;
        const result = await placeBid(auctionId, user.id, amount, io);
        ack?.({ ok: true, result });
      } catch (err) {
        ack?.({ ok: false, error: err instanceof Error ? err.message : "Bid failed" });
      }
    });
  });
}
