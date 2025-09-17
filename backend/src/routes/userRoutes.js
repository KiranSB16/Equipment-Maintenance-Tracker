import express from "express"
import { checkSchema } from "express-validator"
import { userLoginSchema, userRegisterSchema } from "../validators/user-validation-schema.js"
import { userCltr } from "../controllers/user-controller.js"
import AuthenticateUser from "../middleware/authentication.js"
import AuthorizeUser from "../middleware/authorization.js"

const router = express.Router()

router.post("/register" , checkSchema(userRegisterSchema), userCltr.register)
router.post("/login", checkSchema(userLoginSchema) , userCltr.login)
router.get("/",checkSchema(userLoginSchema),AuthenticateUser,AuthorizeUser(['Manager']),userCltr.getUsers)
export default router