import WorkOrder from "../models/workOrder-model.js"
import User from "../models/user-model.js"
import Equipment from "../models/equipment-model.js"
import { validationResult } from "express-validator"

const workOrderCltr = {}

workOrderCltr.getAllWorkOrders = async (req, res) => {
  try {
    const { status, assignedTo } = req.query
    const filter = {}
    if (status) filter.status = status
    if (assignedTo) filter.assignedTo = assignedTo

    const workOrders = await WorkOrder.find(filter)
      .populate("equipment", "name type status")
      .populate("assignedTo", "name email role")

    return res.json(workOrders)
  } catch (err) {
    return res.status(500).json({ message: "Server error" })
  }
}

workOrderCltr.getWorkOrderById = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id)
      .populate("equipment", "name type status")
      .populate("assignedTo", "name email role")

    if (!workOrder) {
      return res.status(404).json({ message: "Work Order not found" })
    }
    return res.json(workOrder)
  } catch (err) {
    return res.status(500).json({ message: "Server error" })
  }
}

workOrderCltr.createWorkOrder = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const workOrder = new WorkOrder(req.body)
    await workOrder.save()

    if (workOrder.equipment) {
      const equipment = await Equipment.findById(workOrder.equipment)
      if (equipment) {
        equipment.status = "Under Maintenance"
        await equipment.save()
      }
    }

    return res.status(201).json(workOrder)
  } catch (err) {
    return res.status(500).json({ message: "Server error" })
  }
}

workOrderCltr.updateWorkOrder = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const workOrder = await WorkOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!workOrder) {
      return res.status(404).json({ message: "Work Order not found" })
    }
    res.json(workOrder)
  } catch (err) {
    return res.status(500).json({ message: "Server error" })
  }
}

workOrderCltr.assignTechnician = async (req, res) => {
  try {
    const { assignedTo } = req.body
    if (!assignedTo) {
      return res.status(400).json({ message: "assignedTo field is required" })
    }

    const workOrder = await WorkOrder.findById(req.params.id)
    if (!workOrder) {
      return res.status(404).json({ message: "Work Order not found" })
    }

    if (workOrder.assignedTo) {
      return res.status(400).json({ message: "Work Order already assigned" })
    }

    const user = await User.findById(assignedTo)
    if (!user || user.role !== "Technician") {
      return res.status(400).json({ message: "User must be a valid Technician" })
    }

    workOrder.assignedTo = assignedTo
    workOrder.status = "In Progress"
    await workOrder.save()

    return res.json({
      message: "Technician assigned successfully, status set to In Progress",
      workOrder,
    })
  } catch (err) {
    return res.status(500).json({ message: "Server error" })
  }
}

workOrderCltr.markAsCompleted = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id)
    if (!workOrder) {
      return res.status(404).json({ message: "Work Order not found" })
    }

    if (String(workOrder.assignedTo) !== String(req.userId)) {
      return res.status(403).json({ message: "Not authorized to complete this work order" })
    }

    workOrder.status = "Completed"
    await workOrder.save()

    return res.json({ 
      message: "Work order marked as Completed. Awaiting supervisor verification.", 
      workOrder 
    })
  } catch (err) {
    return res.status(500).json({ message: "Server error" })
  }
}

workOrderCltr.closeWorkOrder = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id)
    if (!workOrder) {
      return res.status(404).json({ message: "Work Order not found" })
    }

    if (req.userRole !== "Supervisor" && req.userRole !== "Manager") {
      return res.status(403).json({ message: "Only Supervisor/Manager can close work orders" })
    }

    if (workOrder.status !== "Completed") {
      return res.status(400).json({ message: "Work order must be Completed before closing" })
    }

    workOrder.status = "Closed"
    await workOrder.save()

    if (workOrder.equipment) {
      const equipment = await Equipment.findById(workOrder.equipment)
      if (equipment) {
        equipment.status = "Operational"
        await equipment.save()
      }
    }

    return res.json({
      message: "Work order closed by Supervisor and equipment set to Operational",
      workOrder,
    })
  } catch (err) {
    return res.status(500).json({ message: "Server error" })
  }
}

export default workOrderCltr
