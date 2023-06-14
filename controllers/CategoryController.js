const Category = require("../models/Category");
const Product = require("../models/Product");

//create New Category
//Get All Categories
//Get Single Category
//Detele Category
//Edit Category
//Update Category

const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);

    await category.save();

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category Failed to be created",
      });
    }

    res.status(200).json({
      success: true,
      category: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong with the server",
    });
  }
};

const GetAllCategories = async (req, res, next) => {
  try {
    const AllCategories = await Category.find();

    if (!AllCategories) {
      return res.status(400).json({
        success: false,
        message: "Unable to fetch Categories",
      });
    }

    res.status(200).json({
      success: true,
      CategoryList: AllCategories,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Unable to Fetch Categories",
    });
  }
};

const getSingleCategory = async (req, res, next) => {
  try {
    const categoryId = req.query.catId;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "No Category Id found",
      });
    }

    const category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "This Category was not found",
      });
    }

    res.status(200).json({
      success: true,
      categoryItem: category,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong with the Server",
    });
  }
};

const getSubCategory = async (req, res, next) => {
  try {
    const catId = req.params.catId;

    const subCatId = req.query.subCatId;

    if (!subCatId) {
      return res.status(400).json({
        success: false,
        message: "No SubCategory Id found",
      });
    }

    const category = await Category.findOne({ _id: catId });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "No category Found with this Id",
      });
    }

    let subCategory = [];
    for (let i = 0; i < category.subCategory.length; i++) {
      if (category.subCategory[i]._id.toString() === subCatId) {
        subCategory.push(category.subCategory[i]);
      }

      return res.status(200).json({
        success: true,
        subCategory,
      });
    }
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "SubCategory Not found",
    });
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const catId = req.params.catId;

    const { subCategory } = req.body;

    console.log(subCategory);

    if (!catId || !subCategory) {
      return res.status(400).json({
        success: false,
        message: "No id or Data Found",
      });
    }

    const category = await Category.findByIdAndUpdate(
      catId,
      { subCategory },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    console.log(category);

    if (!category) {
      return res.status(400).json({
        sucess: false,
        message: "Category failed to be Updated",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "failed to Update Category",
    });
  }
};


const getProductsBycategory = async (req, res, next) => {

  try {

    let products;
    let numberOfProducts;
    // getProducts by category
    if (req.query.categoryName) {
      products = await Product.find({ categoryName: req.query.categoryName });

     numberOfProducts = products.length
      if (!products || products.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No Product found For this Category",
        });
      }

      return res.status(200).json({
        numberOfProducts,
        success: true,
        products: products,
      });

    } else if (req.query.subCategory) {

      products = await Product.find({ subCategory: req.query.subCategory });

      numberOfProducts = products.length

      if (!products || products.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No Product found For this Category",
        });
      }

      return res.status(200).json({
        numberOfProducts,
        success: true,
        products: products,
      });

    } else if (req.query.unitName) {
      products = await Product.find({ unitCategory: req.query.unitName });

      numberOfProducts = products.length
      if (!products || products.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No Product found For this Category",
        });
      }

      return res.status(200).json({
        numberOfProducts,
        success: true,
        products: products,
      });

    }

    res.status(400).json({
      success: false,
      message: "Please Enter the correct Category",
    });

  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Failed to fetch products that belong to this category",
    });
  }
};

module.exports = {
  createCategory,
  GetAllCategories,
  getSingleCategory,
  getProductsBycategory,

  getSubCategory,
  updateCategory,
};
