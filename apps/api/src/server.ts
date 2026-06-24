import http from "http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { registerSocket } from "./realtime/socket.js";
import { syncAuctionLifecycle } from "./modules/auctions/auctions.service.js";

const app = createApp();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: env.CLIENT_ORIGIN } });

app.set("io", io);
registerSocket(io);
setInterval(() => void syncAuctionLifecycle(io), 10_000);

server.listen(env.PORT, () => logger.info(`API listening on http://localhost:${env.PORT}`));
