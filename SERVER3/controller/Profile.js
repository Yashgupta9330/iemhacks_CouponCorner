const Coupon = require("../models/Coupon");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { UploadImagetoCloudinary } = require("../utils/imageUploader");


// Method for updating a profile
exports.updateProfile = async (req, res) => {
	try {
		const { dateOfBirth = "", about = "", contactNumber ,gender=""} = req.body;
		const id = req.user.id;

		// Find the profile by id
		const userDetails = await User.findById(id);
		const profile = await Profile.findById(userDetails.additionalDetails);

		// Update the profile fields
		profile.dateOfBirth = dateOfBirth;
		profile.about = about;
		profile.contactNumber = contactNumber;
		profile.gender=gender;

		// Save the updated profile
		await profile.save();

		return res.json({
			success: true,
			message: "Profile updated successfully",
			profile,
		});
	} 
	catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

exports.deleteAccount = async (req, res) => {
	try {
		// TODO: Find More on Job Schedule
		// const job = schedule.scheduleJob("10 * * * * *", function () {
		// 	console.log("The answer to life, the universe, and everything!");
		// });
		// console.log(job);
		console.log("Printing ID: ", req.user.id);
		const id = req.user.id;
		
		const user = await User.findById({ _id: id });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}
		// Delete Assosiated Profile with the User
		await Profile.findByIdAndDelete({ _id: user.additionalDetails });
		
		// TODO: Unenroll User From All the Enrolled Courses
		// Now Delete User
		await User.findByIdAndDelete({ _id: id });
		res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ success: false, message: "User Cannot be deleted successfully" });
	}
};

exports.getAllUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const userDetails = await User.findById(id)
			.populate("additionalDetails")
			.exec();
		console.log(userDetails);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
 
exports.updateDisplayPicture = async (req, res) => {
	try {
	  const displayPicture = req.files.displayPicture
	  const userId = req.user.id
	  console.log("error in below 99")
	  const image = await UploadImagetoCloudinary(
		displayPicture,
		process.env.FOLDER_NAME,
		1000,
		1000
	  )
	  console.log("error in below 105")
	  console.log(image)
	  const updatedProfile = await User.findByIdAndUpdate(
		{ _id: userId },
		{ image: image.secure_url },
		{ new: true }
	  )
	  res.send({
		success: true,
		message: `Image Updated successfully`,
		data: updatedProfile,
	  })
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: error.message,
	  })
	}
  }
  
  exports.getEnrolledCoupons = async (req, res) => {
	try {
	  const userId = req.user.id
	  let userDetails = await User.findOne({
		_id: userId,
	  })
		.populate({
		  path: "couponbuy",
		})
		.exec()
	 
	  if (!userDetails) {
		return res.status(400).json({
		  success: false,
		  message: `Could not find user with id: ${userDetails}`,
		})
	  }
	  return res.status(200).json({
		success: true,
		data: userDetails.couponbuy,
	  })
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: error.message,
	  })
	}
  }
  
exports.sellerDashboard = async (req, res) => {
	try {
	    const couponDetails = await Coupon.find({Seller: req.user.id})
		console.log(couponDetails)
	    const couponData = couponDetails.map((coupon) => {
		const  totalBuyerbought= coupon.Buyerbought.length
		const totalAmountGenerated = totalBuyerbought * coupon.price
  
		// Create a new object with the additional fields
		const courseDataWithStats = {
		  _id: coupon._id,
		  couponName: coupon.couponName,
		  couponDescription: coupon.couponDescription,
		  price:coupon.price,
		  totalBuyerbought,
		  totalAmountGenerated,
		  expirydate:coupon.expirydate
		}
  
		return courseDataWithStats
	  })
   
	  res.status(200).json({ couponsell: couponData })
	} catch (error) {
	  console.error(error)
	  res.status(500).json({ message: "Server Error" })
	}
  }
