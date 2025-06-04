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

// ping this every 10 minutes using UptimeRobot to keep server alive, and avoid cold start
app.get("/health", (req, res) => res.sendStatus(200));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

// Connection pooling and keep-alive
const connectWithRetry = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      maxPoolSize: 5, // Maximum number of sockets in the connection pool
      minPoolSize: 1, // Minimum number of sockets to keep in the pool
      socketTimeoutMS: 30000, // Close sockets after 30s of inactivity
      serverSelectionTimeoutMS: 4000, // Fail fast if can't connect
      heartbeatFrequencyMS: 10000, // Send pings every 10 seconds
    })
    .then(() => console.log("MongoDB connected 🎉"))
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      setTimeout(connectWithRetry, 4000); // Retry after 4 seconds
    });
};

const keepAlive = async () => {
  try {
    await mongoose.connection.db.command({ ping: 1 });
    console.log("Keep-alive successful at", new Date().toLocaleTimeString());
  } catch (err) {
    console.error("Keep-alive ping failed:", err.message);
  }
};

mongoose.connection.on("connected", () => {
  setInterval(keepAlive, 600000); // start keep-alive (every 10 minutes = 600000ms)
  keepAlive();
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected - attempting reconnect");
  connectWithRetry();
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

// start initial connection
connectWithRetry();

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  // warm up immediately
  try {
    await mongoose.connection.db
      .collection("users")
      .countDocuments({}, { limit: 1 });
    console.log("Initial warm-up complete");
  } catch (err) {
    console.log("Initial warm-up failed (normal on cold start)", err.message);
  }
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});
