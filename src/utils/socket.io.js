import { Server } from "socket.io";
import http from "http";

export const setupSocketIO = (app) => {
  const server = http.createServer(app);
  
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("sensorData", (data) => {
      console.log("Received sensor data:", data);
      io.emit("sensorUpdate", data);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return server; 
};
