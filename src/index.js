const app = require('./App');
// require('dotenv').config({
//     path: `./.env.${process.env.NODE_ENV || 'development' }`
// });
const cloudinary = require('cloudinary').v2; 
const connectDatabase = require('../Database/Database');

const PORT = process.env.PORT || 3000;

connectDatabase();

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)

})
