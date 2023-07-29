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
router.route('/get-single-category').get(getSingleCategory);

router.route('/get-sub-category/:catId').get(getSubCategory);
router.route('/update-category/:catId').put(updateCategory);
router.route('/get-all-products-by-category').get(getProductsBycategory);


module.exports = router