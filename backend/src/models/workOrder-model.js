import mongoose from "mongoose";
import { Schema, model } from "mongoose";
const workOrderSchema = new Schema(
  {
    title: { type: String, required: true },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
    priority: { type: String, enum: ["Low", "Medium", "High"], required: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed", "Completed"],
      default: "Open",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String },
    dueDate: { type: Date, required: true },
    createdDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const WorkOrder = model("WorkOrder", workOrderSchema);
export default WorkOrder;
