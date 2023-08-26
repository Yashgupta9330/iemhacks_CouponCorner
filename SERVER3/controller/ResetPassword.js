const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


exports.resetPasswordToken= async (req,res)=>{
    try{
        const {email}=req.body;
		
        if(!email){
			return res.status(410).json({
				success:false,
				message:"all field necessary",  
			});
		 }
        const user=await User.findOne({email});
   
        if(!user){
           return res.status(410).json({
               success:false,
               message:"User not rrgistered please sign up",  
           });
        }
               
		      //generating... token
			  const tokens  = crypto.randomBytes(20).toString("hex");
                    console.log("generated token")
      //  const updatedetails=User.findOneAndUpdate( 
       //      {email:email},
       //    {token:tokens,resetPasswordExpires: Date.now() + 5*60*1000},
      //     {new:true}
       //    );
	    user.token=tokens;
        user.resetPasswordExpires=Date.now() + 5*60*1000;
		await user.save();
		console.log(user);

		  console.log("user found out")
         const url= `http://localhost:4000/update-password/${tokens}`
        await mailSender(email,"password reset link",`Password reset link : ${url} `);
          
        return res.status(200).json({
            success:true,
            message:"Email sent successfully please check  email",  
			
        });    
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"something went wrong in resetting password",  
        });
    }
};

exports.resetPassword = async (req, res) => {
	try {
		const { password, confirmPassword, token } = req.body;

		if (confirmPassword !== password) {
			return res.json({
				success: false,
				message: "Password and Confirm Password Does not Match",
			});
		}
		const userDetails = await User.findOne({ token });
		if (!userDetails) {
			return res.status(403).json({
				success: false,
				message: "Token is Invalid",
			});
		}
		if (!(userDetails.resetPasswordExpires > Date.now())) {
			return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate Your Token`,
			});
		}
		const encryptedPassword = await bcrypt.hash(password, 10);
		await User.findOneAndUpdate(
			{ token: token },
			{ password: encryptedPassword },
			{ new: true }
		);
		res.json({
			success: true,
			message: `Password Reset Successful`,
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
		});
	}
};