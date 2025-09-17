import jwt from "jsonwebtoken"
import User from "../models/user-model.js"

export default async function AuthenticateUser(req, res, next) {
    const token = req.headers['authorization']
    if(!token){
        return res.status(401).json({errors: "token is required"})
    }
    try{
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = tokenData.userId
        const user = await User.findById(tokenData.userId)
        if(!user) {
            return res.status(401).json({errors: "Invalid token"})
        }
        req.currentUser = user
        next()
    } catch(err){
        return res.status(401).json({errors: err.message})
    }
}