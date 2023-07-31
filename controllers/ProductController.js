const Product = require("../models/Product");
const Category = require("../models/Category");
const APIFeatures = require("../Util/apiFeatures");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

//1. Create a New Product   - Done
//2. Get All Products  - Done
//3. Get Single Product Details - Done
//4. Update a Single Product - Done
//5. Delete a Single Product - Done
//6. Create a Review / Update a Review - Done
//7. Get Product Review
//8. Delete product Reviews

const createNewProduct = async (req, res, next) => {
  try {
    const selectedCategory = await Category.findOne({
      categoryName: req.body.categoryName,
    });

    req.body.categorylink = selectedCategory._id;
    req.body.user = req.user._id;

    const newProduct = await Product.create(req.body);

    if (!newProduct) {
      return res.status(400).json({
        success: false,
        message: "Product Failed to be created ",
      });
    }

    res.status(201).json({
      success: true,
      message: "Product was successfully Created",
      product: newProduct,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Product failed to be created",
    });
  }
};

const getProducts = async (req, res, next) => {
  try {
    const productsCount = await Product.countDocuments();

    const testProducts = await Product.find();

    const apiFeatures = new APIFeatures(Product.find(), req.query).search();

    const products = await apiFeatures.query;

    let filteredProductsCount = products.length;

    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products cannot be fetched ",
      });
    }

    res.status(200).send({
      success: true,
      data: products,
      productsCount: productsCount,
      filteredProductsCount,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "Products cannot be fetched ",
    });
  }
};

const getProductsByTag = async (req, res, next) => {
  try {
    const products = await Product.find({ tag: req.query.tag });

    if (products.length === 0 || !products) {
      return res.status(404).json({
        success: false,
        message: "No Product with this Tag was found",
      });
    }

    res.status(200).json({
      success: true,
      products: products,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Something went wrong with the server",
    });
  }
};

// 3. Get Single Product Details      -                 /api/v1/product/:id
const getSingleProductDetails = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).send({
      success: true,
      data: product,
    });
  } catch (err) {
    res.status(404).send({
      success: false,
      message: "Product not Found",
    });
  }
};

// 4. Update a single Product         -                 /api/v1/admin/product/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        useFindAndModify: true,
      }
    );

    if (!updateProduct) {
      return res.status(400).json({
        success: false,
        message: "Failed to Update Product",
      });
    }

    res.status(200).send({
      success: true,
      data: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong with the server",
    });
  }
};

// 5. Delete a Single Product         -                 /api/v1/admin/product/:id
const DeleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(400).json({
        success: false,
        message: "Product Not Found",
      });
    }

    for (let i = 0; i < product.images.length; i++) {
      const result = await cloudinary.uploader.destroy(
        product.images[i].public_id
      );
    }

    const belongedCategory = await Category.findOne({
      _id: product.categorylink,
    });

    if (belongedCategory) {
      belongedCategory.productList = belongedCategory.productList.filter(
        (singleObj) => singleObj.product !== product._id
      );

      await belongedCategory.save();
    }

    await Product.deleteOne({ _id: req.params.id });

    res.status(200).send({
      success: true,
      message: "Product has been deleted",
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "The product failed to be deleted",
    });
  }
};

// 6. Create a Review / Update an existing Review -     /api/v1/review
const createProductReview = async (req, res, next) => {

  try {
    const { image, comment, productId } = req.body;

    const review = {
      user: req.user.id,
      name: req.user.name,
      image,
      comment,
    };

    const product = await Product.findById(productId);

    //check if user has reviewed this product
    const isReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    //If user already has a review For this product, we update the review
    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user._id.toString()) {
          review.comment = comment;
          review.image = image;
        }
      });

      //else we push the new Review into the reviews Array
      //and update the number of reviews.
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    await product.save({ validateBeforeSave: false });

    res.status(200).send({
      success: true,
      review,
    });
  } catch (err) {

    res.status(400).send({
      success: false,
      message: "Review Failed to be updated",
    });
  }
};

const storage = multer.diskStorage({});

const upload = multer({
  storage: storage,
});

//upload image
const uploadImage = async (req, res, next) => {
  try {
    let images = [];

    req.files.forEach((singleImage) => {
      images.push(singleImage.path);
    });

    let cloudinaryResponse = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "Goldland",
      });


      cloudinaryResponse.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    res.status(200).send({
      success: true,
      data: cloudinaryResponse,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "picture could not be uploaded",
    });
  }
};

module.exports = {
  createNewProduct,
  getProducts,
  getProductsByTag,
  getSingleProductDetails,
  updateProduct,
  DeleteProduct,
  createProductReview,

  upload,
  uploadImage,
};
