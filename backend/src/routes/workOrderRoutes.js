import express from "express"
import { checkSchema } from "express-validator"
import workOrderCltr from "../controllers/workOrder-controller.js"
import { workOrderValidationSchema } from "../validators/workOrder-validation-schema.js"
import AuthenticateUser from "../middleware/authentication.js"
import AuthorizeUser from "../middleware/authorization.js"

const router = express.Router()

router.get("/", AuthenticateUser, workOrderCltr.getAllWorkOrders)
router.get("/:id", AuthenticateUser, workOrderCltr.getWorkOrderById)

router.post(
  "/",
  checkSchema(workOrderValidationSchema),
  AuthenticateUser,
  AuthorizeUser(["Supervisor", "Manager"]),
  workOrderCltr.createWorkOrder
)

router.put(
  "/:id",
  checkSchema(workOrderValidationSchema),
  AuthenticateUser,
  AuthorizeUser(["Supervisor", "Manager"]),
  workOrderCltr.updateWorkOrder
)

router.patch(
  "/:id/assign",
  AuthenticateUser,
  AuthorizeUser(["Supervisor", "Manager"]),
  workOrderCltr.assignTechnician
)

router.patch(
  "/:id/complete",
  AuthenticateUser,
  AuthorizeUser(["Technician"]),
  workOrderCltr.markAsCompleted
)

router.patch(
  "/:id/close",
  AuthenticateUser,
  AuthorizeUser(["Supervisor", "Manager"]),
  workOrderCltr.closeWorkOrder
)

export default router
