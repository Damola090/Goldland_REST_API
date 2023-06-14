const express = require('express');
const router = express.Router();

const { SendPaystackKey } = require('../controllers/PaymentController');

router.route('/payment/publicKey').get(SendPaystackKey)

module.exports = router;