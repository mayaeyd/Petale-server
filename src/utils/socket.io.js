import { createServer } from "http";
import { Server } from "socket.io";

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // ...
  });

  httpServer.listen(3000);
};
