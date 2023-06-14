const express = require('express');
const router = express.Router();

const { 
    createNewUser, 
    loginUser,
    getUserProfile, 
    logOutUser, 
    UpdatePassword,
    getAllUsers,
    getSingleUser,
    storePhoneToken
} = require('../controllers/AuthController');

const { AuthMiddleware, AuthorizeRoles } = require('../middleware/AuthMiddleware');

router.route('/create-user').post(createNewUser); //create a new user
router.route('/login-user').post(loginUser); // login existing user
router.route('/get-my-profile').get(AuthMiddleware, getUserProfile); // get logged in user profile
router.route('/logout-user').get(AuthMiddleware, logOutUser); // logout user
router.route('/update-password').post(AuthMiddleware, UpdatePassword); // update user password
router.route('/fetch-fcm-token/:id').post(storePhoneToken);

router.route('/admin/get-all-users').get(AuthMiddleware, AuthorizeRoles('Admin'), getAllUsers);
router.route('/admin/get-single-user/:id').get(AuthMiddleware, AuthorizeRoles('Admin'), getSingleUser);

module.exports = router