import type { Server as HttpServer } from "node:http";
import jwt from "jsonwebtoken";
import { Server as SocketServer } from "socket.io";
import type { Role, User } from "@prisma/client";
import { env, frontendOrigins } from "../config/env.js";
import { prisma } from "../prisma.js";

type JwtPayload = {
  sub: string;
  role: Role;
};

let io: SocketServer | null = null;

export const initRealtime = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: frontendOrigins(),
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const authToken = socket.handshake.auth?.token;
      const header = socket.handshake.headers.authorization;
      const bearerToken = typeof header === "string" && header.startsWith("Bearer ") ? header.slice(7) : null;
      const token = authToken || bearerToken;
      if (!token) return next(new Error("UNAUTHENTICATED"));

      const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      const user = await prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || user.status !== "ACTIVE") return next(new Error("UNAUTHENTICATED"));

      socket.data.user = user;
      next();
    } catch {
      next(new Error("UNAUTHENTICATED"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user as User;
    socket.join(`user:${user.id}`);

    socket.on("thread:join", (threadId: string) => {
      if (threadId) socket.join(`thread:${threadId}`);
    });

    socket.on("thread:leave", (threadId: string) => {
      if (threadId) socket.leave(`thread:${threadId}`);
    });
  });

  return io;
};

export const emitToUser = (userId: string, event: string, payload: unknown) => {
  io?.to(`user:${userId}`).emit(event, payload);
};

export const emitToThread = (threadId: string, event: string, payload: unknown) => {
  io?.to(`thread:${threadId}`).emit(event, payload);
};

export const emitContentUpdated = (payload: unknown) => {
  io?.emit("content:updated", payload);
};
