import express from "express";
import { db } from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import ministriesRoutes from "./routes/ministries.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user_router.js";

dotenv.config();

const app = express();
app.use(cors({
 origin:true,
  credentials: true
}));

app.use(express.json({ limit: "15mb" })); // base64 pode ser grande




app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/auth", authRoutes);
app.use("/ministries", ministriesRoutes);
app.use("/upload", uploadRoutes);
app.use("/admin", adminRoutes);

app.use("", userRoutes);

export default app;
