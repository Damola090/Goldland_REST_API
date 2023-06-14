const User = require("../models/User");
const ErrorHandler = require("../Util/ErrorHandler");

//User Route

//1. Create a New User   - Done
//2. Login Existing User - Done
//3. Get Currently Logged in User Profile - Done
//4. logOut User
//5. Update / change Password
//6. Update User Profile
//7. Forgot Password
//9. Reset Password

//Admin Route

//1. Get All Users
//2. Get a Particular User Details
//3. Update a Particular User Profile
//4. Delete User

const createNewUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    const token = await user.generateAuthToken();

    if (user === null || undefined || !user) {
      return res.status(400).json({
        success: false,
        message: "User Failed to be created",
      });
    }

    return res.status(201).json({
      success: true,
      user: user,
      token: token,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "User Failed to be created",
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please type in Your Password", 401));
    }

    const user = await User.fetchdata(req.body.email, req.body.password);

    if (!user) {
      throw new Error("Login Failed");
    }

    const token = await user.generateAuthToken();

    res.status(200).json({
      success: true,
      user: user,
      token: token,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Invalid UserName or Password",
    });
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "This User Cannot be found",
      });
    }

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "something went wrong with the Server",
    });
  }
};

const logOutUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User Failed to be logged out",
      });
    }

    req.token = undefined;
    res.status(200).json({
      success: true,
      message: "User has been Logged Out Successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "User Failed to be logged out",
    });
  }
};

const UpdatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    const isMatched = await user.comparePassword(req.body.oldPassword);

    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Your old Password is incorrect",
      });
    }

    user.password = req.body.password;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Your password has been changed successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "password could not be changed ",
    });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "User" });

    if (!users || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "failed to fetch all users",
      });
    }

    res.status(200).json({
      success: true,
      users: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "something went wrong with the server",
    });
  }
};

const getSingleUser = async (req, res, next) => {
  try {
    const singleUser = await User.findById(req.params.id);

    if (!singleUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: false,
      singleUser: singleUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "something went wrong with the server",
    });
  }
};

const storePhoneToken = async (req, res, next) => {

  try {

    console.log(req.body)
    console.log(req.params.id)
    console.log('before sending query')
    const user = await User.findById({ _id: req.params.id });

    console.log(user)

    if (!user || user === null) {
      return res.status(404).json({
        success: false,
        message: "This User was not found",
      });
    }

    if (req.body.fetchedToken === undefined || !req.body.fetchedToken) {
      return res.status(404).json({
        success: false,
        message: "No Token was found",
      });
    }

    user.userToken = req.body.fetchedToken;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Notification is currently Active",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "something went wrong with the server",
    });
  }
};

module.exports = {
  createNewUser,
  loginUser,
  getUserProfile,
  logOutUser,
  UpdatePassword,
  getAllUsers,
  getSingleUser,
  storePhoneToken,
};
