import express from "express";
import { checkSchema } from "express-validator";
import equipmentCltr from "../controllers/equipment-controller.js";
import { equipmentValidationSchema } from "../validators/equipment-validation-schema.js";
import AuthenticateUser from "../middleware/authentication.js";
import AuthorizeUser from "../middleware/authorization.js";

const router = express.Router();

router.get("/", AuthenticateUser, equipmentCltr.getAllEquipments);
router.post(
  "/",
  checkSchema(equipmentValidationSchema),
  AuthenticateUser,
  AuthorizeUser(["Supervisor", "Manager"]),
  equipmentCltr.createEquipment
);
router.put(
  "/:id",
  checkSchema(equipmentValidationSchema),
  AuthenticateUser,
  AuthorizeUser(["Supervisor", "Manager"]),
  equipmentCltr.updateEquipment
);

export default router;
