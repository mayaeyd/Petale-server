import { Server } from "socket.io";
import { WebSocketServer } from "ws";

const setupWebSocket = (server) => {
  // Initialize a socket.io server and attach it to the provided http server
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });
  // Creates a WebSocket server
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    if (request.url === "/ws") {
      // Upgrades the HTTP connection to a WebSocket connection
      wss.handleUpgrade(request, socket, head, (ws) => {
        // Emits a connection event to let the WebSocket server handle the new connection
        wss.emit("connection", ws, request);
      });
    }
  });

  wss.on("connection", (ws) => {
    // Listens for messages from the WebSocket client
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        // Broadcasts the parsed data to all connected Socket.IO clients using the sensor_data event
        io.emit("sensor_data", data);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });
  });

  return { io, wss };
};

export default setupWebSocket;
