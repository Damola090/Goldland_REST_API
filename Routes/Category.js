const express = require('express');
const router = express.Router()

const { 
    createCategory, 
    GetAllCategories, 
    getSingleCategory,
    getSubCategory,
    updateCategory ,
    getProductsBycategory
} = require('../controllers/CategoryController');
const { AuthMiddleware } = require('../middleware/AuthMiddleware');

router.route('/create-category').post(createCategory);
// router.route('/get-all-category').get(AuthMiddleware, GetAllCategories);
router.route('/get-all-category').get(GetAllCategories);
router.route('/get-single-category').get(AuthMiddleware, getSingleCategory);

router.route('/get-sub-category/:catId').get(AuthMiddleware, getSubCategory);
router.route('/update-category/:catId').put(AuthMiddleware, updateCategory);
router.route('/get-all-products-by-category').get(AuthMiddleware, getProductsBycategory);


module.exports = router