const mongoose = require("mongoose");
require("dotenv").config();

function connectDb() {
    var local = process.env.DBURI;
    mongoose
        .connect(local, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
        })
        .then(() => {
            console.log("Database Connected !!!");
        })
        .catch((e) => {
            console.log(e);
        });
}

module.exports = connectDb;
