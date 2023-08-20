const mongoose = require('mongoose')

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((con) => {
        console.log(`Database connection has been established ${con.connection.host}`)
    })
}

module.exports = connectDatabase;
