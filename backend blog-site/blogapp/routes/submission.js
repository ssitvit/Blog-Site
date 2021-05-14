var express = require('express');
var router = express.Router();
var mongoose = require("mongoose")
//External module link
var blogModule = require("../modules/blog_sub")

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

router.post('/submission',(req,res)=>{
  var author = req.body.Blog_Author;
  var title = req.body.Blog_title;
  var desc = req.body.Blog_desc;
  var content = req.body.Blog_content;
  var usertoken=localStorage.getItem("loginuser");
  // var image = req.body.Blog_images;

  var Blog = new blogModule({
    author: author,
    title: title,
    desc: desc,
    body: content
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