const mongoose=require("mongoose");

const ratingAndReviewSchema=new mongoose.Schema({
      review:{
        type:String,
        required:true
    },
 
     user:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }],
    rating:{
        type:Number,
        required:true
    },
    coupon: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Coupon",
		index: true,
	},
  
});

module.exports=mongoose.model("RatingAndReview",ratingAndReviewSchema);