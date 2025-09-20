import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { configureDb } from "../config/db.js";
import cors from "cors";
configureDb();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173", // frontend dev
  "https://equipment-maintenance-tracker.vercel.app", // your actual frontend URL
  "https://equipment-maintenance-tracker-srno-pcz7j0261-kiran-sbs-projects.vercel.app", // backend URL (just in case)
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

const port = process.env.PORT;

import userRoutes from "./routes/userRoutes.js";
import equipmentRoutes from "./routes/equipmentRoutes.js";
import workOrderRoutes from "./routes/workOrderRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

app.use("/api/users", userRoutes);
app.use("/api/equipments", equipmentRoutes);
app.use("/api/workOrders", workOrderRoutes);
app.use("/api/reports", reportRoutes);

app.listen(port, () => {
  console.log("server is running at port", port);
});
