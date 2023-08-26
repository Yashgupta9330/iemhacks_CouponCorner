const  mongoose  = require("mongoose");
const Category = require("../models/Category");
function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}


exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

exports.showAllCategories = async (req, res) => {
	try {
        console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategorys = await Category.find({});
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

//categoryPageDetails 

exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      console.log("PRINTING CATEGORY ID: ", categoryId);
      // Get coupons for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "coupons",
          match: { status: "valid" },
          populate: "ratingAndReviews",
        })
        .exec()
  
      console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no coupons
      if (selectedCategory.coupons.length === 0) {
        console.log("No coupons found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No coupons found for the selected category.",
        })
      }
  
      // Get coupons for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "coupons",
          match: { status: "valid" },
        })
        .exec()
        //console.log("Different COURSE", differentCategory)
      // Get top-selling coupons across all categories
      const allCategories = await Category.find()
        .populate({
          path: "coupons",
          match: { status: "Published" },
          populate: {
            path: "Seller",
        },
        })
        .exec()
      const allcoupons = allCategories.flatMap((category) => category.coupons)
      const mostSellingcoupons = allcoupons
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
       // console.log("mostSellingcoupons COURSE", mostSellingcoupons)
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingcoupons,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }




  /*const Tag = require("../models/Category");
const User=require("../models/Category");


exports.createTag= async (req,res)=>{
    try{
        const {name,description}=req.body;

        if( !name || !description){
           return res.status(403).json({
               success:false,
               message:"ALL fields required",  
           });
       }

       const tagdetails=await Tag.create({
            name:name,
            description:description
       });

       console.log(tagdetails);

       return res.status(200).json({
        success:true,
        message:"tag created successfully",  
    });    
    
}
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,  
        });
    }
}


exports.showalltags= async (req,res)=>{
    try{
        const alltag=Tag.find({},{name:true,description:true});

        return res.status(200).json({
            success:true,
            message:"tag sent successfully",  
            alltags
        });    
    }

    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,  
        });
    }
}
*/