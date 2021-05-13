const mongoose = require("mongoose");
mongoose
    .connect("mongodb://localhost:27017/Blog", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database Connected!");
    })
    .catch((e) => {
        console.log("Database COnnection Failed!!");
    });

var conn = mongoose.connection;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true,
        },
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true,
        },
    },
    password: {
        type: String,
        required: true,
    },
});

const blogmodel = mongoose.model("blog", userSchema);
module.exports = blogmodel;
