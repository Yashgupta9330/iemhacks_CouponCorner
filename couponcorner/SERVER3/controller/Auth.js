const User=require("../models/User");
const OTP=require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
 require("dotenv").config();
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");



//send OTP

exports.sendOTP= async (req,res)=>{
    try{
         //fetching email from req body
        const {email}=req.body;

    const checkUserPresent=await User.findOne({email});
   
        if(checkUserPresent){
           return res.status(401).json({
               success:false,
               message:"User already exist",  
           });
        }
     
        //otp generator

        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
             lowerCaseAlphabets:false,
             specialChars:false,
        })
        console.log("otp generated",otp);

        const checkotpPresent=await OTP.findOne({otp:otp});

        while(checkotpPresent){
            var otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                 lowerCaseAlphabets:false,
                  specialChars:false,
            });
             checkotpPresent=await OTP.findOne({otp:otp});
        }
        const otpPayload={email,otp};
        const otpBody=await OTP.create(otpPayload);
        console.log(otpBody);
        return res.status(200).json({
            success:true,
            message:"OTP sent successfully", 
             otp 
        });    
    }
    catch(error){
             console.log(error);
             return res.status(500).json({
                success:false,
                message:"login failure please try again",  
            });
    }
    
    
    };

    //sign up
    exports.signUp=async (req,res)=>{
   try{

    const {firstName,lastName,email,password,confirmPassword,otp,accountType}=req.body;
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp ){
        return res.status(403).json({
            success:false,
            message:"ALL fields required",  
        });
    }

    if(password!=confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password not matched",  
        });
    }

    
    const checkUser=await User.findOne({email});
   
    if(checkUser){
       return res.status(401).json({
           success:false,
           message:"User already exist",  
       });
    }
       // Find the most recent OTP for the email
       const recentOTP=await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
       console.log(recentOTP);
       console.log("error in below 99")
       if(otp.length==0){
        return res.status(400).json({
            success:false,
            message:"otp not found",  
        });
       }

      else if(otp!= recentOTP.otp){
        return res.status(410).json({
            success:false,
            message:"INVALID OTP",  
        });
       }
          console.log("error in below 133")
       const hashedPassword=await bcrypt.hash(password,10);

       const Profiledetails=await Profile.create({
           gender:null,
           dateofbirtth:null,
           about:null,
           contactNumber:null
       }); 

       	// Create the user
	//	let approved = "";
	//	approved === "Instructor" ? (approved = false) : (approved = true);

       const user=await User.create({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        accountType,
        additionalDetails:Profiledetails._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        token:null,
        resetPasswordExpires:null,
       })
       
       return res.status(200).json({
        success:true,
        message:"User registered successfully",  
        user
    });    
    }
       catch(error){
         console.log(error);  
         return res.status(500).json({
            success:false,
            message:"signup failure please try again",  
        });
    }

};

//login

exports.login=async (req,res)=>{
    try{
         const {email,password}=req.body;
         if( !password || !email){
            return res.status(403).json({
                success:false,
                message:"ALL fields required",  
            });
        }

        const user=await User.findOne({email}).populate("additionalDetails");
        console.log(user)
       console.log("error in below 166")
        if(!user){
           return res.status(410).json({
               success:false,
               message:"User not registered please sign up",  
           });
        }
      //  const hashPassword=await bcrypt.hash(password,10);
       //  if(hashPassword==user.password) {
       if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                accountType:user.accountType,
                id:user._id
            }
            console.log("error in below 179")
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            user.token=token;
            user.password=undefined;
            console.log("error in below 185")
            const options={
                expiresIn:new Date(Date.now()+3*24*60*60*1000),
                httponly:true,
            }
          res.cookie("token",token,options).status(200).json({
            token,
            user,
            success:true,
            message:"Sign in successfully",  
        });
        console.log("error in below 196")
          
        }
        else{
            return res.status(401).json({
                success:false,
                message:"INCORRECT PASSWORD",  
            });
        }

    }
    catch(error){
        console.log(error);  
        return res.status(500).json({
            success:false,
            message:"login failure please try again",  
        });
    }
};







exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword,confirmNewPassword} = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		 if (newPassword !== confirmNewPassword) {
		// 	// If new password and confirm new password do not match, return a 400 (Bad Request) error
		return res.status(400).json({
			success: false,
		message: "The password and confirm password does not match",
		});
		 }

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} 
        catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res.status(200).json({
             success: true,
              message: "Password updated successfully"
             });
	} 
    catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};