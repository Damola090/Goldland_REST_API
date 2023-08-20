const { DateTime } = require("luxon");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const admin = require("firebase-admin");

const serviceAccount = require('../goldland-mobile-firebase-adminsdk-y5nbk-739ccfcd53.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 1. Create A New Order       -    /api/v1/order/new
const newOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
    } = req.body;

    const GoldlandAdmin = await User.findOne({ role: "admin" });

    const order = await Order.create({
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
      paidAt: Date.now(),
      user: req.user._id,
    });

    if (order) {
      const customer = await User.findById(req.user._id);

      if (!customer || customer === null) {
        return res.status(400).json({
          success: false,
          message: "The User who placed the order was not found",
        });
      }

      await admin.messaging().sendMulticast({
        tokens: [customer.userToken],
        notification: {
          title: "Payment Has been Confirmed",
          body: "Your Order is being processed",
          imageUrl: order.orderItems[0].image,
        },
      });

      //Admin Token has not been registered yet
      // await admin.messaging().sendMulticast({
      //   tokens: [GoldlandAdmin.userToken],
      //   notification: {
      //     title: "You have a New Order",
      //     body: "This msg is for admin only",
      //     imageUrl: order.orderItems[0].image,
      //   },
      // });
    }

    const obj = {
      time: Date.now(),
      title: "Order Created",
      description: "Your Order has been Created",
      status: "Order Placed", // we might hardcode this
    };

    order.orderStatus[0] = obj;

    await order.save();

    res.status(200).send({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Order failed to be created",
    });
  }
};

// 2. Get Single Order         -    /api/v1/order/:id
const getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return next(new ErrorHandler("No order found with this ID", 404));
    }

    res.status(200).send({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(404).send({
      success: false,
      message: "Order not found",
    });
  }
};

// 3. Get logged in User order -    /api/v1/order/me
const myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id });


    res.status(200).send({
      success: true,
      data: orders,
    });
  } catch (err) {
    // If Order is not found in database

    res.status(404).send({
      success: false,
      message: "No orders found",
    });
  }
};

//4 GET ALL ORDERS  - ADMIN
const GetAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email");

    let totalAmount = 0;

    orders.forEach((order) => {
      totalAmount += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      orders,
      totalAmount,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Unable To Fetch Orders",
    });
  }
};

//5 => Process All Orders - ADMIN
const ProcessOrder = async (req, res, next) => {

  let user;
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      user = await User.findById({ _id: order.user });
    }

    //Check if order has been Delivered
    const isDelivered = order.orderStatus.find(
      (singleOrder) => singleOrder.status === "Delivered"
    );

    //Throw Error if order Has already been delivered
    if (isDelivered || order.orderStatus.length === 4) {
      throw new Error("This Order has been Delivered");
    }

    const update = req.body.status;

    if (update === "Order Placed") {
      return;
    }

    if (update === "Payment Confirmed") {
      // step 1

      // if current Order status is "order Placed" , update to Payment Confirmed
      const order_placed = order.orderStatus[0].status === "Order Placed";

      if (order_placed) {
        const obj = {
          time: Date.now(),
          title: "Payment Received",
          description: "Your Payment has been Confirmed",
          status: req.body.status, // we might hardcode this
        };

        order.orderStatus[1] = obj;

        await order.save();

        await admin.messaging().sendMulticast({
          tokens: [user.userToken],
          notification: {
            title: "Payment Has been Confirmed",
            body: "Your Order is being processed",
            imageUrl: order.orderItems[0].image,
          },
        });

        return res.status(200).json({
          success: true,
          status: order.orderStatus[1].status,
        });
      }
    }

    if (update === "Shipped out") {
      // step 2

      // if current Order status is "payment Confirmed" , update to "items in Transit"
      const payment_confirmed = order.orderStatus.find(
        (singleOrder) => singleOrder.status === "Payment Confirmed"
      );

      if (payment_confirmed) {
        const descriptionId = order._id.toString().substring(12, 24);

        const obj = {
          time: Date.now(),
          title: "Items in Transit",
          description: `${descriptionId} is on the way`,
          status: req.body.status,
        };

        order.orderStatus[2] = obj;

        await order.save();

        await admin.messaging().sendMulticast({
          tokens: [user.userToken],
          notification: {
            title: obj.title,
            body: obj.description,
            imageUrl: order.orderItems[0].image,
          },
        });

        return res.status(200).json({
          success: true,
          status: order.orderStatus[2].status,
        });
      }
    }

    if (update === "Delivered") {
      // step 3

      // if current Order status is "items in Transit" , update to "Delivered"
      const items_in_Transit = order.orderStatus.find(
        (singleOrder) => singleOrder.status === "Shipped out"
      );

      if (items_in_Transit) {
        const obj = {
          time: Date.now(),
          title: "Delivered Successfully",
          description: "Thank You for your patronage",
          status: req.body.status,
        };

        order.orderStatus[3] = obj;

        order.orderItems.forEach(async (item) => {
          await updateStock(item.product, item.quantity);
        });

        await order.save();

        await admin.messaging().sendMulticast({
          tokens: [user.userToken],
          notification: {
            title: obj.title,
            body: obj.description,
            imageUrl: order.orderItems[0].image,
          },
        });

        return res.status(200).json({
          success: true,
          status: order.orderStatus[3].status,
        });
      }
    }
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Order Processing Failed",
    });
  }
};

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
}

//5 => Process All Orders - ADMIN

const DeleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new Error("Order Not Found");
    }

    const response = await Order.deleteOne({ _id: order._id });

    res.status(200).json({
      success: true,
      message: "order successfully Deleted",
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Order Failed to be Deleted",
    });
  }
};

module.exports = {
  newOrder: newOrder,
  getSingleOrder: getSingleOrder,
  myOrders: myOrders,
  GetAllOrders: GetAllOrders,
  ProcessOrder: ProcessOrder,
  DeleteOrder: DeleteOrder,
};
