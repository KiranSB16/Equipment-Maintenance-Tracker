import express from "express"
import { checkSchema } from "express-validator"
import { userLoginSchema, userRegisterSchema } from "../validators/user-validation-schema.js"
import { userCltr } from "../controllers/user-controller.js"

const router = express.Router()

router.post("/register" , checkSchema(userRegisterSchema), userCltr.register)
router.post("/login", checkSchema(userLoginSchema) , userCltr.login)
router.get("/",userCltr.getUsers)
export default router