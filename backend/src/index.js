import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { configureDb } from "../config/db.js";
import cors from "cors";
configureDb();

const app = express();
app.use(express.json());


app.use(cors({
  origin: "*", // Only for testing!
  credentials: false, // Must be false when using wildcard
}));


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
