import mongoose from "mongoose"
export const configureDb = async() => {
    try{
        const db = await mongoose.connect(process.env.DB_URL)
        console.log("Connected in db")

    } catch(err){
        console.log(err)
    }

}