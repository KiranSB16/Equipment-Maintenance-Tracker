import {Schema, model} from "mongoose"
const userSchema = new Schema ({
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
name: { type: String, required: true },
role: { type: String, enum: ['Technician', 'Supervisor', 'Manager'], required: true }  
})
const User = model("User", userSchema)
export default User