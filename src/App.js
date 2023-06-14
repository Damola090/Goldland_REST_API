const express = require('express');
const bodyParser = require('body-parser');

const Category = require('../models/Category');

const app = express();

app.use(bodyParser.json())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))


//Import all Routers
const user = require('../Routes/Auth');
const product = require('../Routes/Product');
const category = require('../Routes/Category');
const Order = require('../Routes/Order');
const Payment = require('../Routes/Payment');

//Configure Routers
app.use('/api/v1/', user);
app.use('/api/v1/', product);
app.use('/api/v1/', category);
app.use('/api/v1', Order);
app.use('/api/v1', Payment)


module.exports = app


