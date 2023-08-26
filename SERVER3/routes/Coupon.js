const express = require("express")
const router = express.Router()

// Import the Controllers

// Coupon Controllers Import
const {
  createCoupon,
  getAllCoupon,
  getCouponDetails,
  getFullCouponDetails,
  editcoupon,
  getsellercoupons,
  deleteCoupon,
} = require("../controller/Coupon")


// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controller/Category")



// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controller/RatingandReview")


// Importing Middlewares
const { auth, isBuyer, isSeller, isAdmin } = require("../middlewares/auth")

// ********************************************************************************************************
//                                      Coupon routes
// ********************************************************************************************************

// Coupons can Only be Created by Instructors
router.post("/createCoupon", auth, isSeller, createCoupon)
// Get all Registered Coupons
router.get("/getAllCoupon", getAllCoupon)
// Get Details for a Specific Coupons
router.post("/getCouponDetails", getCouponDetails)
// Get Details for a Specific Coupons
router.post("/getFullCouponDetails", auth, getFullCouponDetails)
// Edit Coupon routes
router.post("/editcoupon", auth, isSeller, editcoupon)
// Get all Coupons Under a Specific Instructor
router.get("/getsellercoupons", auth, isSeller, getsellercoupons)
// Delete a Coupon
router.delete("/deleteCoupon", deleteCoupon)



// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isBuyer, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router