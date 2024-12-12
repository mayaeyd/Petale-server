import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.listen(process.env.SERVER_PORT,()=>{
    console.log(`Server running on port ${process.env.SERVER_PORT}`);
});