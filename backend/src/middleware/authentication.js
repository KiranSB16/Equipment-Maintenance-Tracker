import jwt from "jsonwebtoken"
export default function AuthenticateUser(req , res , next) {
    const token = req.headers['authorization']
    if(!token){
        res.status(401).json({errors : "token is required"})
    }

    try{
        const tokenData = jwt.verify(token , process.env.JWT_SECRET)
        req.userId = tokenData.userId
        next()

    } catch(err){
        return res.status(401).json({errors : err.message})

    }
}