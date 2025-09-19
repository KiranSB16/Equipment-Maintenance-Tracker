import express from "express";
import reportCltr from "../controllers/report-controller.js";
import AuthenticateUser from "../middleware/authentication.js";
import AuthorizeUser from "../middleware/authorization.js";

const router = express.Router();

router.get(
  "/equipment-status",
  AuthenticateUser,
  AuthorizeUser(["Manager"]),
  reportCltr.equipmentStatus
);

router.get(
  "/work-orders",
  AuthenticateUser,
  AuthorizeUser(["Manager"]),
  reportCltr.workOrderSummary
);

router.get(
  "/technician-workload",
  AuthenticateUser,
  AuthorizeUser(["Manager"]),
  reportCltr.technicianWorkload
);

export default router;
