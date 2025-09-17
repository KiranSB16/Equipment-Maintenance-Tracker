import express from "express"
import reportCltr from "../controllers/report-controller.js"
import AuthenticateUser from "../middleware/authentication.js"
import AuthorizeUser from "../middleware/authorization.js"

const router = express.Router()

// Supervisor/Manager only
router.get("/equipment-status", AuthenticateUser, AuthorizeUser(["Supervisor", "Manager"]), reportCltr.equipmentStatus)

router.get("/work-orders", AuthenticateUser, AuthorizeUser(["Supervisor", "Manager"]), reportCltr.workOrderSummary)

router.get("/technician-workload", AuthenticateUser, AuthorizeUser(["Supervisor", "Manager"]), reportCltr.technicianWorkload)

export default router
