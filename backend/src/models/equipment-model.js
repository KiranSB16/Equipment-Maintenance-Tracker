import {Schema, model} from "mongoose"
const equipmentSchema = new Schema({
    name: {type: String, required:true},
    type:{type:String, required:true},
    status:{type:String, enum:['Operational', 'Under maintenance', 'Out of service']},
    lastMaintenanceDate:{type:Date, required:true},
    nextMaintenanceDate:{type:Date, required:true}
}, {timestamps:true})
const Equipment = model('Equipment', equipmentSchema)
export default Equipment