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
      eq.name || "N/A",
      eq.type || "N/A",
      eq.status || "N/A",
      eq.lastMaintenanceDate ? eq.lastMaintenanceDate.toDateString() : "N/A"
    ])
    
    generatePDF({
      title: "Equipment Status Report",
      columns: ["Equipment Name", "Type", "Status", "Last Maintenance"],
      rows,
      res
    })
  } catch (err) {
    console.error("Equipment report error:", err)
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
      filter.createdAt = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      }
    }

    const workOrders = await WorkOrder.find(filter)
      .populate("equipment", "name")
      .populate("assignedTo", "name role email")
      .sort({ createdAt: -1 }) // Most recent first

    const rows = workOrders.map(wo => [
      wo.title || "N/A",
      wo.equipment?.name || "Unassigned",
      wo.status || "N/A",
      wo.assignedTo?.name || "Unassigned",
      wo.createdAt ? wo.createdAt.toDateString() : "N/A"
    ])

    generatePDF({
      title: "Work Order Summary Report",
      columns: ["Work Order Title", "Equipment", "Status", "Assigned To", "Created Date"],
      rows,
      res
    })
  } catch (err) {
    console.error("Work order report error:", err)
    return res.status(500).json({ message: "Error generating work order report" })
  }
}

// Technician Workload (Fixed version with email included)
reportCltr.technicianWorkload = async (req, res) => {
  try {
    // Get all technicians with their details
    const technicians = await User.find({ 
      role: "Technician" 
    }).select("name email role")

    // Calculate workload for each technician
    const workloadData = await Promise.all(
      technicians.map(async tech => {
        const inProgressCount = await WorkOrder.countDocuments({ 
          assignedTo: tech._id, 
          status: "In Progress" 
        })
        
        const completedCount = await WorkOrder.countDocuments({ 
          assignedTo: tech._id, 
          status: "Completed" 
        })

        return {
          name: tech.name || "Unknown",
          email: tech.email || "No email",
          inProgressOrders: inProgressCount,
          completedOrders: completedCount,
          totalOrders: inProgressCount + completedCount
        }
      })
    )

    // Sort by workload (open orders) descending
    workloadData.sort((a, b) => b.inProgressOrders - a.inProgressOrders)

    const rows = workloadData.map(tech => [
      tech.name,
      tech.email,
      tech.inProgressOrders.toString(),
      tech.completedOrders.toString(),
      tech.totalOrders.toString()
    ])

    generatePDF({
      title: "Technician Workload Report",
      columns: ["Technician Name", "Email", "InProgress Orders", "Completed Orders", "Total Orders"],
      rows,
      res
    })
  } catch (err) {
    console.error("Technician workload report error:", err)
    return res.status(500).json({ message: "Error generating technician workload report" })
  }
}

export default reportCltr