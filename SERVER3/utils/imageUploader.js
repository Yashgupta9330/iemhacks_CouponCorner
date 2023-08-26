// Require the Cloudinary library
const cloudinary = require('cloudinary').v2

exports.UploadImagetoCloudinary=async (file,folder,height,quality)=>{
   try{
      const options={folder};
      if(height){
         options.height=height;
      }
      if(quality){
         options.quality=quality;
      }
      options.resources_type="auto";

      return await cloudinary.uploader.upload(file.tempFilePath,options);
   }
   catch(error){
      console.error('Error uploading image to Cloudinary:', error);
      throw error; 
   }
       
}