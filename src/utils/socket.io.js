import { Server } from "socket.io";
import { WebSocketServer } from "ws";

const setupWebSocket = (server) => {
  // Initialize a socket.io server and attach it to the provided http server
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });
  // Creates a WebSocket server
  const wss = new WebSocketServer({ noServer: true });

  return { io, wss };
};

export default setupWebSocket;
