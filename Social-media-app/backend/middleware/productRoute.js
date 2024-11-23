import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

const protuctRoute= async (req,res,next)=>{
    try {


        const token = req.cookies.jwt;
        if(!token){
            return res.status(400).json({error:"unauthorized : no token provider"})
        }

        const decode= jwt.verify(token,process.env.JWT_SECRET)

        if(!decode){
            return res.status(400).json({error:"unauthorized : invalid token"})
        }
     const user = User.findOne({_id: decode.userId}).select("-password")

     if(!user){
        return res.status(400).json({error:"user not found"})
    }

    req.user =user;-
    next()

    } catch (error) {

        console.log(`error in product Route middle ware${error}`)
        res.status(500).json({error:"internal server Error"})
        
    }
    
}
export default protuctRoute;