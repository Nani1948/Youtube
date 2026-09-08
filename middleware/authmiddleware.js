import jwt from "jsonwebtoken";

//Authentication middleware

export const authMiddleware = (req,res,next) =>{
  try{
     //Get token from Authorization header
     const authHeader=req.headers.authorization;

     //Check whether token is provided
     if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
        message:"No token provided.Authorization required."
        });

     }
     //Extract token from Bearer <token>
     const token =authHeader.split(" ")[1];
     
     //Verify JWT Token
     const decoded=jwt.verify(token,process.env.JWT_SECRET);

     //Store user information in request
     req.user=decoded;

     //Continue to the next middleware 
     next();
  }
    catch(error){
        //Token is invalid or expired
        return res.status(401).json({
            message:"Invalid or expired token"
        });
    }
};