import { io } from "socket.io-client";
import { SOCKET_URL, sessionStore } from "./api.js";

let socket = null;

export function getSocket() {
  const token = sessionStore.token();
  if (!token) return null;
  if (socket?.connected) return socket;
  socket?.disconnect();
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"]
  });
  return socket;
}

export function closeSocket() {
  socket?.disconnect();
  socket = null;
}
