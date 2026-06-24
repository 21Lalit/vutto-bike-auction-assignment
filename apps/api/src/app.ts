import cors from "cors";
import express from "express";
import { existsSync } from "fs";
import helmet from "helmet";
import path from "path";
import rateLimit from "express-rate-limit";
import * as pinoHttpModule from "pino-http";
import { logger } from "./config/logger.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { auctionsRouter } from "./modules/auctions/auctions.routes.js";
import { bikesRouter } from "./modules/bikes/bikes.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";
import { sellRouter } from "./modules/sell/sell.routes.js";
import { watchlistRouter } from "./modules/watchlist/watchlist.routes.js";
import { requestsRouter } from "./modules/requests/requests.routes.js";
import { errorHandler, notFound } from "./http/errors.js";
import { asyncHandler } from "./http/asyncHandler.js";
import { metricsMiddleware, metricsText, readiness } from "./http/observability.js";
import { requestId } from "./middleware/requestId.js";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(requestId);
  app.use(helmet());
  app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173", credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(rateLimit({ windowMs: 60_000, limit: 120 }));
  const pinoHttp = ((pinoHttpModule as any).default ?? pinoHttpModule) as typeof import("pino-http").default;
  app.use(pinoHttp({ logger, genReqId: (req) => req.requestId ?? "unknown" }));
  app.use(metricsMiddleware);

  app.get("/health", asyncHandler(async (_req, res) => res.json(await readiness())));
  app.get("/health/live", (_req, res) => res.json({ ok: true, service: "bike-auction-api", time: new Date().toISOString() }));
  app.get("/health/ready", asyncHandler(async (_req, res) => res.json(await readiness())));
  app.get("/metrics", (_req, res) => res.type("text/plain").send(metricsText()));
  app.use("/api/auth", authRouter);
  app.use("/api/auctions", auctionsRouter);
  app.use("/api/bikes", bikesRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/sell", sellRouter);
  app.use("/api/watchlist", watchlistRouter);
  app.use("/api/requests", requestsRouter);
  serveFrontend(app);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

function serveFrontend(app: express.Express) {
  if (process.env.NODE_ENV !== "production") return;
  const candidates = [
    path.resolve(process.cwd(), "../web/dist"),
    path.resolve(process.cwd(), "apps/web/dist")
  ];
  const distPath = candidates.find((candidate) => existsSync(path.join(candidate, "index.html")));
  if (!distPath) {
    logger.warn({ candidates }, "Frontend build output was not found; API-only mode enabled");
    return;
  }
  app.use(express.static(distPath, { index: false, maxAge: "1h" }));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/health") || req.path === "/metrics") return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}
