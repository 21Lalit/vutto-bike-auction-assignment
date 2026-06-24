import type { NextFunction, Request, Response } from "express";
import { prisma } from "../db/prisma.js";

const startedAt = Date.now();
const counters = new Map<string, number>();
const durations = new Map<string, { count: number; totalMs: number; maxMs: number }>();

function labelFor(req: Request, statusCode: number) {
  const route = req.route?.path ? `${req.baseUrl}${req.route.path}` : req.path;
  return `method="${req.method}",route="${route}",status="${statusCode}"`;
}

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const label = labelFor(req, res.statusCode);
    counters.set(label, (counters.get(label) ?? 0) + 1);
    const current = durations.get(label) ?? { count: 0, totalMs: 0, maxMs: 0 };
    durations.set(label, {
      count: current.count + 1,
      totalMs: current.totalMs + elapsedMs,
      maxMs: Math.max(current.maxMs, elapsedMs)
    });
  });
  next();
}

export function metricsText() {
  const lines = [
    "# HELP bike_auction_uptime_seconds Process uptime in seconds.",
    "# TYPE bike_auction_uptime_seconds gauge",
    `bike_auction_uptime_seconds ${Math.floor((Date.now() - startedAt) / 1000)}`,
    "# HELP bike_auction_http_requests_total Total HTTP requests.",
    "# TYPE bike_auction_http_requests_total counter"
  ];
  for (const [labels, value] of counters) {
    lines.push(`bike_auction_http_requests_total{${labels}} ${value}`);
  }
  lines.push("# HELP bike_auction_http_request_duration_ms HTTP request duration summary in milliseconds.");
  lines.push("# TYPE bike_auction_http_request_duration_ms summary");
  for (const [labels, value] of durations) {
    lines.push(`bike_auction_http_request_duration_ms_count{${labels}} ${value.count}`);
    lines.push(`bike_auction_http_request_duration_ms_sum{${labels}} ${value.totalMs.toFixed(2)}`);
    lines.push(`bike_auction_http_request_duration_ms_max{${labels}} ${value.maxMs.toFixed(2)}`);
  }
  return `${lines.join("\n")}\n`;
}

export async function readiness() {
  await prisma.$queryRaw`SELECT 1`;
  return {
    ok: true,
    service: "bike-auction-api",
    database: "ok",
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    time: new Date().toISOString()
  };
}
