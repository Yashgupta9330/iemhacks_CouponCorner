const  jwt=require("jsonwebtoken");
const User=require("../models/User");

require("dotenv").config();

exports.auth= async (req,res,next)=>{
    try{
        //extract token Authorization  || req.header("Authorization").replace("Bearer","")
        const token=req.body.token|| req.cookies.token || req.header("Authorization").replace("Bearer","");
        if(!token){
            return res.status(403).json({
                success:false,
                message:"token is missing",  
            });
        }

        try{
          const decode=await jwt.verify(token,process.env.jwt_secret);
          console.log(decode);
          req.user=decode;
        }
        catch(error){
            return res.status(403).json({
                success:false,
                message:"token is invalid",  
            });
        }
        next();
    }
    catch(error){
        console.log(error);  
        return res.status(500).json({
            success:false,
            message:"some thing went wrong in token validation",  
        });
    }
};




exports.isBuyer= async (req,res,next)=>{
    try{
         if(req.user.accountType!=="Buyer"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for Buyer",  
            });
         }
         next();
    }
        catch(error){
            return res.status(500).json({
                success:false,
                message:"user role cannot be verified",  
            });
        }
    };


    exports.isSeller= async (req,res,next)=>{
        try{
             if(req.user.accountType!=="Seller"){
                return res.status(401).json({
                    success:false,
                    message:"this is protected route for  Seller",  
                });
             }
             next();
        }
            catch(error){
                return res.status(500).json({
                    success:false,
                    message:"user role cannot be verified",  
                });
            }
        };



//accountType
        exports.isAdmin= async (req,res,next)=>{
            try{
                console.log("account type:",req.user.accountType);
                 if(req.user.accountType!=="Admin"){
                    return res.status(401).json({
                        success:false,
                        message:"this is protected route for  Admin",  
                    });
                 }
                 next();
            }
                catch(error){
                    return res.status(500).json({
                        success:false,
                        message:"user role cannot be verified",  
                    });
                }
            };
    
