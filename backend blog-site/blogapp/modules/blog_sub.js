const mongoose=require('mongoose');
const { JSDOM } = require('jsdom')
const marked = require('marked')
const createDomPurify = require('dompurify')
const dompurify = createDomPurify(new JSDOM().window)
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
        required: true,
        default:"",
    },
    
    sanitizedHtml: {
        type: String,
        required: true
      }
   
}, {timestamps: true})

blogSchema.pre('validate',function(next){
    if(this.body){
        this.sanitizedHtml=dompurify.sanitize(marked(this.body))
    }
    next()
})
const submodel = mongoose.model("blog_sub", blogSchema);
module.exports = submodel;