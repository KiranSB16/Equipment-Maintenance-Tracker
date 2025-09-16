import dotenv from "dotenv"
dotenv.config()
import express from "express"
import { configureDb } from "../config/db.js"
configureDb()

const app = express()
app.use(express.json())

const port = process.env.PORT

import userRoutes from "./routes/userRoutes.js"

//import equipmentRoutes from "./routes/equipmentRoutes.js"

app.use("/api/users", userRoutes)
//app.use("/api/equipments", equipmentRoutes)

app.listen(port, () => {
    console.log("server is running at port", port)
})
