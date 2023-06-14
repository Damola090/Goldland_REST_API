const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ErrorHandler = require('../Util/ErrorHandler');

const AuthMiddleware = async (req, res, next) => {

    try {

        const token = req.header('Authorization').replace('Bearer ', '');

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY_);

        const user = await User.findOne({ _id : decodedToken.id });

        if (!user) {
            throw new Error('Please Authenticate')
        }

        req.user = user
        req.token = token

        next()

    } catch (err) {

        res.status(401).json({
            success: false,
            message : "Please Kindly Login or SignUp"
        })
    }
}


//Handling user Roles
const AuthorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(
                // new ErrorHandler(`Role ${req.user.role} is not Authourized to access this resource`, 403)
                res.status(401).json({ message : `Role ${req.user.role} is not Authourized to access this resource`})
            )

        }
        next()
    }
}


module.exports = {
    AuthMiddleware,
    AuthorizeRoles
}