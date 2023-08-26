const mongoose=require("mongoose");

const tagsSchema=new mongoose.Schema({
      name:{
        type:String,
        required:true
    },
 
    coupons:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Coupon",
    }],

    description:{
        type:String,
    },
   
  
});

module.exports=mongoose.model("Category",tagsSchema);