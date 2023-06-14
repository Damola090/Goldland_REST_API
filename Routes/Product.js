const express = require('express');
const router = express.Router();

const { 
    createNewProduct, 
    getProducts, 
    getProductsByTag,
    getSingleProductDetails,
    updateProduct,
    DeleteProduct,
    createProductReview,

    upload,
    uploadImage
} = require('../controllers/ProductController');

const { AuthMiddleware } = require('../middleware/AuthMiddleware');

router.route('/get-all-products').get(getProducts);
// router.route('/get-all-products').get(AuthMiddleware, getProducts);
router.route('/get-products-tag').get(AuthMiddleware, getProductsByTag);
router.route('/get-single-product/:id').get(AuthMiddleware, getSingleProductDetails);

router.route('/admin/create-new-product').post(AuthMiddleware, createNewProduct);
router.route('/admin/get-single-product/:id')
    .put(AuthMiddleware, updateProduct)
    .delete(AuthMiddleware, DeleteProduct)

router.route('/create-product-review').put(AuthMiddleware, createProductReview);
router.post('/admin/product/image', AuthMiddleware, upload.array('image', 6), uploadImage)


module.exports = router