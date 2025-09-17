import Equipment from "../models/equipment-model.js"
import WorkOrder from "../models/workOrder-model.js"
import User from "../models/user-model.js"
import { generatePDF } from "../utils/reportPdf.js"

const reportCltr = {}

// Equipment Status Report
reportCltr.equipmentStatus = async (req, res) => {
  try {
    const equipments = await Equipment.find().select("name type status lastMaintenanceDate")
    const rows = equipments.map(eq => [
      eq.name,
      eq.type,
      eq.status,
      eq.lastMaintenanceDate?.toDateString() || "N/A"
    ])
    generatePDF({
      title: "Equipment Status Report",
      columns: ["Name", "Type", "Status", "Last Maintenance"],
      rows,
      res
    })
  } catch (err) {
    return res.status(500).json({ message: "Error generating equipment report" })
  }
}

// Work Order Summary (filterable by status/date)
reportCltr.workOrderSummary = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query
    const filter = {}

    if (status) filter.status = status
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
    }

    const workOrders = await WorkOrder.find(filter)
      .populate("equipment", "name")
      .populate("assignedTo", "username role")

    const rows = workOrders.map(wo => [
      wo.title,
      wo.equipment?.name || "N/A",
      wo.status,
      wo.assignedTo?.username || "Unassigned",
      wo.createdAt.toDateString()
    ])

    generatePDF({
      title: "Work Order Summary",
      columns: ["Title", "Equipment", "Status", "Assigned To", "Created At"],
      rows,
      res
    })
  } catch (err) {
    return res.status(500).json({ message: "Error generating work order report" })
  }
}

// Technician Workload
reportCltr.technicianWorkload = async (req, res) => {
  try {
    const technicians = await User.find({ role: "Technician" })
    const workload = await Promise.all(
      technicians.map(async tech => {
        const count = await WorkOrder.countDocuments({ assignedTo: tech._id, status: { $ne: "Closed" } })
        return [tech.username, count]
      })
    )

    generatePDF({
      title: "Technician Workload",
      columns: ["Technician", "Open Work Orders"],
      rows: workload,
      res
    })
  } catch (err) {
    return res.status(500).json({ message: "Error generating technician report" })
  }
}

export default reportCltr
