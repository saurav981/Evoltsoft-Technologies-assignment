import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import chargerRoutes from "./routes/chargerRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again in 15 minutes",
});
app.use("/api", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/chargers", chargerRoutes);

app.get("/health", (req, res) => res.sendStatus(200));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected 🎉"))
  .catch((error) => {
    console.log("MongoDB connection error server:", error);
    process.exit(1);
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
