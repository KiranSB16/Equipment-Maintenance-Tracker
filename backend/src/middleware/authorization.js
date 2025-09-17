const AuthorizeUser = (permittedRole)=>{
    return(req,res, next)=>{
        if(permittedRole.includes(req?.currentUser?.role)){
            next()
        }else{
            return res.status(403).json({errors:"unauthorized access"})
        }
    }
}
export default AuthorizeUser