import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDB from "./db/connection.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import plantsRoutes from "./routes/plants.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import setupWebSocket from "./utils/socket.io.js";
import { createServer } from "http";

dotenv.config();

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/plants", plantsRoutes);
app.use("/orders", ordersRoutes);

try {
  await connectToDB();
  setupWebSocket(server);
  server.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}`);
  });
} catch (error) {
  console.error("Failed to connect to MongoDB:", error);
}
