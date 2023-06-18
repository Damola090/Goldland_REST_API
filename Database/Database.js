const mongoose = require('mongoose')

// 'mongodb://127.0.0.1:27017/GoldLand'

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((con) => {
        console.log(`Database connection has been established ${con.connection.host}`)
    })
}

module.exports = connectDatabase;
