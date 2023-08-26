const nodemailer = require("nodemailer");

const mailSender=async (email,title,body)=>{
    try{
      let transporter=nodemailer.createTransport({
        host:process.env.Mail_Host,
        auth:{
            user:process.env.Mail_User,
            pass:process.env.Mail_Pass,
        }
      })

      let info=await transporter.sendMail({
             from:"yaahg342@gmail.com",
             to:`${email}`,
             subject:`${title}`,
              html:`${body}`
      })
      console.log(info);
      return info;
    }
    catch(error){
                  console.log(error.message);
    }
}
module.exports=mailSender;