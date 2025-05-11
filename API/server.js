import express from "express";
import dontenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";

import authRouter from "./routes/auth.route.js";
import merchantRouter from "./routes/merchant.route.js";
import deliveryRouter from "./routes/delivery.route.js";

dontenv.config();

const app = express();

// Genreal middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL (React app running on port 3000)
    credentials: true, // Allow cookies to be sent with requests
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

app.use("/api/auth", authRouter);
app.use("/api/merchant", merchantRouter);
app.use("/api/delivery", deliveryRouter);

app.use((err, req, res, next) => {
  const code = err.code || 500;
  const msg = err.message || "INTERNAL SERVER ERROR";

  res.status(code).json({
    success: false,
    message: msg,
    code: code,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  connectDB();
  console.log(`APP RUNNING ON PORT => ${PORT}`);
});
