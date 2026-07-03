import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { createServer } from "node:http";
import { initRealtime } from "./services/realtime.service.js";

const app = createApp();
const server = createServer(app);

initRealtime(server);

server.listen(env.PORT, () => {
  console.log(`API server listening on http://localhost:${env.PORT}`);
});
