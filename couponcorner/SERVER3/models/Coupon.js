const mongoose=require("mongoose");

const couponSchema=new mongoose.Schema({
     couponName:{
        type:String,
        required:true
    },
      
    Seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
   couponDescription:{
        type:String,
        required:true
    },
    price:{
        type:Number,
    },
   couponContent:{
       type:String,
       required:true 
    },
    thumbnail:{
        type:String, 
    },
    ratingAndReview:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
    }],
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category", 
    },
    status: {
		type: String,
		enum: ["expired", "valid"],
	},
      Buyerbought:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User", 
            required:true
        }
    ],

    expirydate:{
        type:Date,
        required:true
      },

    createdAt: {
		type:Date,
		default:Date.now
	},
 
  
});

module.exports=mongoose.model("Coupon",couponSchema);