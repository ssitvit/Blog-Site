<<<<<<< HEAD
const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/blog",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
});
=======
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
>>>>>>> 40dca282bd6f745c8251e3f7491b63ffb7c9da19

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
<<<<<<< HEAD
    
    
    
  });
=======
});
>>>>>>> 40dca282bd6f745c8251e3f7491b63ffb7c9da19

const blogmodel = mongoose.model("blog", userSchema);
module.exports = blogmodel;
