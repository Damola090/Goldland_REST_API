const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    categoryName: { //Furniture
        type: String,
        required: [true, "please put it a Category Name"]
    },
    categoryImage: {
        type: String,
        default: "No Image Yet"
    },
    subCategory : [ 
        {
            subName : {  // livingRoom Furniture
                type : String,
            },
            subNameImage : {
                type: String,
                default: "No subNameImage Yet"

            },
            unitCategory : [ 
                {
                    unitName : { // sofas
                        type : String
                    },
                    unitNameImage : {
                        type: String,
                        default: "No Image Yet"
                    }
                }
            ]
        }
    ],
    productList : [
        {
            product: {
                type : mongoose.Schema.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ]
})

const Category = mongoose.model('Category', CategorySchema)

module.exports = Category