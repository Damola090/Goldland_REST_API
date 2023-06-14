const express = require('express');

const router = express.Router();

const { 
    newOrder,
    getSingleOrder,
    myOrders,
    GetAllOrders,
    ProcessOrder,
    DeleteOrder
} = require('../controllers/OrderController');

const { AuthMiddleware, AuthorizeRoles } = require('../middleware/AuthMiddleware');


router.post('/order/new', AuthMiddleware, newOrder);    //Create an Order
router.get('/orders/me', AuthMiddleware, myOrders);     // Get All Orders created by User
router.get('/order/:id', AuthMiddleware, getSingleOrder); // Get Individual Orders
router.get('/admin/orders/', AuthMiddleware, AuthorizeRoles('Admin'), GetAllOrders);

router.route('/admin/order/:id')
    .post(AuthMiddleware, AuthorizeRoles('Admin'), ProcessOrder)
    .delete(AuthMiddleware, AuthorizeRoles('Admin'), DeleteOrder)

module.exports = router