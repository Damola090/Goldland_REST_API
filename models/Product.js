const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Add a Product"],
        trim: true,
        maxLength: [100, "Product Name must not exceed 100 characters"]
    },
    price: {
        type: Number,
        required: [true, 'please enter Produt Price'],
        maxLength: [5, 'Product Price cannot exceed 5 Characters'],
        default: 0
    },
    description: {
        type: String,
        required: [true, "Please Add Product Description"],
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                default: "No Image yet"
            },
            url: {
                type: String,
                default: "No Image Yet"
            }
        }
    ],
    categoryName: {
        type: String,
        required: [true, "Please select Category For This Product"],
        enum: {
            values : [
                'furniture',
                'Lighting',
                'Decoration',
                'Bedding & Bath',
                'storage',
                'bathroom',
                'rugs',
                'TableTop',
                'matresses',
                'outdoor',
                'kids',
                'bedding',
            ],
            message: "Please select Correct category for Product"
        }
    },
    subCategory: {
        type: String,
        required: [true, "Please select a SubCategory"]
    },
    unitCategory: {
        type: String,
        required: [true, "please select a Unit Category"]
    },
    categorylink : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        required: [true, "Please select a link"]
    },
    sizes: [
        {
            productSize : {
                type: String,
                required: true
            }
        }
    ],
    colors: [
        {
            productColor : {
                type: String,
                required: true
            }
        }
    ],
    slideShow: {
        type: Boolean,
        default: false
    },
    trending: {
        type: Boolean,
        default: false
    },
    latest: {
        type: Boolean,
        default: false
    },
    stock : {
        type: Number,
        required: [true, "please enter product Stock"],
        maxLength: [5, 'product name cannot exceed 5 characters'],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required : true
            },
            name : {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    tag: {
        type: String,
        required: [true, "Please select a Tag For This Product"],
        enum: {
            values : [
                'Table',
                'Chair',
                'Decoration',
                'Light',
                'Rug',
                'Console',
                'Dinning',
                'kitchen',
                'Bathroom',
                'Outdoor',
                'Kids',
            ],
            message: "Please select Correct Tag for Product"
        }
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }  
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product