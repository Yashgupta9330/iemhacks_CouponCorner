const mongoose=require("mongoose");
require("dotenv").config();

exports.connect=()=>{
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
    }).then(console.log("connection succesful"))
    .catch((error)=>{
        console.log("db facing error");
        console.log(error);
        process.exit(1);
    })
};
