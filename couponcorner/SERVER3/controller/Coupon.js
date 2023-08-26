
const Coupon = require("../models/Coupon")
const Category = require("../models/Category")
const User = require("../models/User")
const { UploadImagetoCloudinary } = require("../utils/imageUploader")
const { convertSecondsToDuration } = require("../utils/secToDuration")

exports.createCoupon= async (req,res)=>{
  try{
  const userId = req.user.id
  // Get all required fields from request body
  let {
    couponName,
    couponDescription,
    couponContent,
    price,
    category,
    expirydate
  } = req.body
  // Get thumbnail image from request files
  const thumbnail = req.files.thumbnailImage
  let Status="valid";
  console.log( couponName,
    couponDescription,
    couponContent,
    price,
    category,
    expirydate,thumbnail)
 

  // Check if any of the required fields are missing
  if (
    !couponName ||
    !couponDescription || !couponContent ||
    !price ||
    !thumbnail ||
    !category || !expirydate)  {
    return res.status(400).json({
      success: false,
      message: "All Fields are Mandatory",
    })
  }
 
 let date1=Date.now()
 const date2=expirydate
  if(date1>date2){
    Status="expired"
   }
  
   
  // Check if the user is an seller
  const SellerDetails = await User.findById(userId, {
    accountType: "Seller",
  })

  if (!SellerDetails) {
    return res.status(404).json({
      success: false,
      message: "Seller Details Not Found",
    })
  }

  // Check if the category given is valid
  const categoryDetails = await Category.findById(category)
  if (!categoryDetails) {
    return res.status(404).json({
      success: false,
      message: "Category Details Not Found",
    })
  }
  // Upload the Thumbnail to Cloudinary
  const thumbnailImage = await UploadImagetoCloudinary(
    thumbnail,
    process.env.FOLDER_NAME
  )
  console.log(thumbnailImage)
  // Create a new coupon with the given details
  const newcoupon = await Coupon.create({
    couponName,
    couponDescription,
    Seller: SellerDetails._id,
    couponContent,
    price,
    category: categoryDetails._id,
    thumbnail: thumbnailImage.secure_url,
    status: Status,
    expirydate
        
  })
 
  // Add the new coupon to the User Schema of the Instructor
  await User.findByIdAndUpdate(
    {
      _id: SellerDetails._id,
    },
    {
      $push: {
        couponsell: newcoupon._id,
      },
    },
    { new: true }
  )
  // Add the new coupon to the Categories
  const categorydetails = await Category.findByIdAndUpdate(
    { _id: category },
    {
      $push: {
        coupons: newcoupon._id,
      },
    },
    { new: true }
  )
  console.log("HEREEEEEEEE", categorydetails)
  
  // Return the new coupon and a success message
  res.status(200).json({
    success: true,
    data: newcoupon,
    message: "coupon Created Successfully",
  })
}
 catch (error) {
  // Handle any errors that occur during the creation of the coupon
  console.error(error)
  res.status(500).json({
    success: false,
    message: "Failed to create coupon",
    error: error.message,
  })
}
}
exports.editcoupon = async (req, res) => {
  try {
    const { couponId } = req.body
    const updates = req.body
    const coupon = await Coupon.findById(couponId)

    if (!coupon) {
      return res.status(404).json({ error: "coupon not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      coupon.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" ) {
          coupon[key] = JSON.parse(updates[key])
        } else {
          coupon[key] = updates[key]
        }
      }
    }

    await coupon.save()

    const updatedcoupon = await Coupon.findOne({
      _id: couponId,
    })
      .populate({
        path: "Seller",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .exec()

    res.json({
      success: true,
      message: "coupon updated successfully",
      data: updatedcoupon,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
// Get coupon List
exports.getAllCoupon = async (req, res) => {
  try {
    const allCoupons = await Coupon.find(
      { status: "valid" }
    ) .populate({
      path: "Seller"
    })
      .exec()

    return res.status(200).json({
      success: true,
      data: allCoupons,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Coupon  Data`,
      error: error.message,
    })
  }
}
// Get One Single Course Details
// exports.getCourseDetails = async (req, res) => {
//   try {
//     const { courseId } = req.body
//     const courseDetails = await Course.findOne({
//       _id: courseId,
//     })
//       .populate({
//         path: "instructor",
//         populate: {
//           path: "additionalDetails",
//         },
//       })
//       .populate("category")
//       .populate("ratingAndReviews")
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec()
//     // console.log(
//     //   "###################################### course details : ",
//     //   courseDetails,
//     //   courseId
//     // );
//     if (!courseDetails || !courseDetails.length) {
//       return res.status(400).json({
//         success: false,
//         message: `Could not find course with id: ${courseId}`,
//       })
//     }

//     if (courseDetails.status === "Draft") {
//       return res.status(403).json({
//         success: false,
//         message: `Accessing a draft course is forbidden`,
//       })
//     }

//     return res.status(200).json({
//       success: true,
//       data: courseDetails,
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }
exports.getCouponDetails = async (req, res) => {
  try {
    const { couponId } = req.body
    const couponDetails = await Coupon.findOne({
      _id: couponId,
    })
      .populate({
        path: "Seller",
        populate:({
          path: "additionalDetails",
        })
      })
      .populate("tag")
      .populate("ratingAndReview")
      .exec()

    if (!couponDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${couponId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

  
   

    return res.status(200).json({
      success: true,
      data: {
        couponDetails,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
exports.getFullCouponDetails = async (req, res) => {
  try {
    const { couponId } = req.body
    const userId = req.user.id
    const couponDetails = await Coupon.findOne({
      _id: couponId,
    })
      .populate({
        path: "Seller",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .exec()

   
    if (!couponDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${couponId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }


    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Course for a given Instructor
exports.getsellercoupons = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const sellerId = req.user.id

    // Find all courses belonging to the seller
    const sellerCourses = await Coupon.findById({
      Seller: sellerId
    })

    // Return the seller's courses
    res.status(200).json({
      success: true,
      data: sellerCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve seller courses",
      error: error.message,
    })
  }
}
// Delete the Coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const {couponId } = req.body

    // Find the coupon
    const coupon = await Coupon.findById(couponId)
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" })
    }

    // Unenroll students from the course
    const Buyerbought= coupon.Buyerbought
    for (const studentId of Buyerbought) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { couponbuy: couponId },
      })
    }

    // Delete the course
    await Coupon.findByIdAndDelete(couponId)

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}