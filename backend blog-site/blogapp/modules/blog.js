const mongoose = require("mongoose");
// const dbURI = 'mongodb+srv://Shreyansh1410:Qwertyui1410@blog.9due1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
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
