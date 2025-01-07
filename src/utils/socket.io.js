import { Server } from "socket.io";
import { WebSocketServer, WebSocket } from "ws";

const setupWebSocket = (server) => {
  // Initializes a socket.io server and attach it to the provided http server
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
    pingTimeout: 30000,
    pingInterval: 5000,
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
    console.log("Arduino connected to WebSocket");

    // Setup ping-pong
    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        // Broadcasts the parsed data to all connected Socket.IO clients using the sensor_data event
        console.log("Received data:", data);
        io.emit("sensor_data", data);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.on("close", () => {
      console.log("Arduino disconnected");
    });
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on("close", () => {
    clearInterval(interval);
  });

  io.on("connection", (socket) => {
    // socket.io event
    console.log("Frontend client connected");
    socket.on("water_now", (duration) => {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          // Sends a JSON-encoded message to the WebSocket client with
          // the type water_now and the specified duration.
          client.send(JSON.stringify({ type: "water_now", duration }));
        }
      });
    });
    // socket.io event
    socket.on("update_schedule", (schedule) => {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          // Sends a JSON-encoded message to the WebSocket client with
          // the type update_schedule and the schedule data spread (...schedule)
          client.send(JSON.stringify({ type: "update_schedule", ...schedule }));
        }
      });
    });
    // socket.io event
    socket.on("disconnect", () => {
      console.log("Frontend client disconnected");
    });
  });

  return { io, wss };
};

export default setupWebSocket;
