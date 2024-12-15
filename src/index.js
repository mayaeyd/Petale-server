import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDB from "./db/connection.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import plantsRoutes from "./routes/plants.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/plants", plantsRoutes);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`);
  connectToDB();
});
