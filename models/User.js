const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        maxLength: [30, "Your Username cannon be more than 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a Valid Email"]
    },
    password: {
        type: String,
        required : [true, "please Enter Your Password"],
        minlength: [6, "Your Password must be longer than 6 Characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            default: "No Image Yet"
        },
        url: {
            type: String,
            default: "No Image Yet"
        }
    },
    role: {
        type: String,
        default: "User"
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    unseenNotifications: {
        type: Array,
        default: []
    },
    seenNotifications: {
        type: Array,
        default: []
    },
    forgotPassword : {
        type: Number,
        default : 0
    },
    userToken: {
        type: String,
        default: ''
    }
})


//Hash Password  
UserSchema.pre('save', async function (next) {

    //retruns true if 'password' path is modified else false    
        if (this.isModified('password')){
            this.password = await bcrypt.hash(this.password, 8)
        }
    
        next()
    })
    
//compare Password 
UserSchema.methods.comparePassword = async function(enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password)
}

//Generate jsonwebtoken
UserSchema.methods.generateAuthToken = async function() {

    const token = jwt.sign({ id : this._id.toString() }, 'mysecretkey', {expiresIn: "1h"})

    await this.save()

    return token;
}

//login user 
UserSchema.statics.fetchdata = async (email, password) => {
    const user = await User.findOne({email}).select('+password')

    if (!user) {
        throw new Error("Invalid UserName or password")
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        throw new Error("pls try Again")
    }

    return user;
}



const User = mongoose.model('User', UserSchema);

module.exports = User;