const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/Blog",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
});

var conn=mongoose.connection;

const userSchema=new mongoose.Schema({
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

  const blogmodel=mongoose.model("blog",userSchema);
  module.exports = blogmodel;