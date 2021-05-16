var express = require('express');
var router = express.Router();
var mongoose = require("mongoose")
//External module link
var blogModule = require("../modules/blog_sub")

// multer module 
var multer = require("multer");
// defining the static path for saving the image
var path=require('path');
router.use(express.static(__dirname + "./public"));

// checking user is login or not in a function
function checkLoginuser(req,res,next){
    var usertoken=localStorage.getItem("usertoken")
    try {
      var decoded = jwt.verify(usertoken, 'logintoken');
    } catch(err) {
      res.redirect('/login');
    }
    next();
}
router.use(express.urlencoded({ extended: true }));

//Get Submission
router.get('/submission',checkLoginuser, function(req, res, next) {
    res.render('submission', { title: 'Submission' });
});

// diskstorage multer function
var Storage=multer.diskStorage({
  destination:"./public/upload/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+Date.now()+path.extname(file.originalname))
  }
});


// middle ware for multer 
var upload=multer({storage:Storage}).single('file');

// function for finding data from our data base 
var blogshow=blogModule.find({});



router.post('/submission',upload,(req,res)=>{
 

  var usertoken=localStorage.getItem("loginuser");
  var author =usertoken ;
  var title = req.body.Blog_title;
  var desc = req.body.Blog_desc;
  var content = req.body.Blog_content;
  var usertoken=localStorage.getItem("loginuser");
  var image = req.file.filename;
 

  var Blog = new blogModule({
    author: author,
    title: title,
    desc: desc,
    body: content,
    image:image,
    
  });
  Blog.save((err, doc)=>{
    if (err) throw err;
    res.render('submission',{
      title: "Submitted",
      msg: "Your Blog has been submitted",
      userdetails: usertoken
    })
  })
})



module.exports = router;