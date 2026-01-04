import http from "http";
import express from "express";
import cors from "cors";
import { startMempoolRelay } from "./mempool-ws.js";

const app = express();
app.use(cors());

const server = http.createServer(app);

startMempoolRelay(server);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
