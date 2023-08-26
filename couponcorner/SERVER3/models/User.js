const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    accountType:{
        type:String,
        enum:["Admin","Buyer","Seller"],
        required:true
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile"
    },
     couponsell :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Coupon"
    }],
    couponbuy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Coupon"
    }],
    image:{
        type:String,
        required:true,
    },
    token:{
        type:String, 
    },
    resetPasswordExpires:{
        type:Date,
    }

});

module.exports=mongoose.model("User",userSchema);