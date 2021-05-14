const mongoose=require('mongoose');
// const dbURI = 'mongodb+srv://Shreyansh1410:Qwertyui1410@blog.9due1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const local = "mongodb://localhost:27017/blog"
mongoose.connect(local,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
}),()=>{
  console.log('Connected to Database')
};
var conn = mongoose.connection;

const blogSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default:Date.now,
        
    },
}, {timestamps: true})

const submodel = mongoose.model("blog_sub", blogSchema);
module.exports = submodel;