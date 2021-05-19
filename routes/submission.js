var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
//External module link
var blogModule = require("../modules/blog_sub");

// multer module
var multer = require("multer");
// defining the static path for saving the image
var path = require("path");
router.use(express.static(__dirname + "./public"));

// checking user is login or not in a function
async function checkLoginuser(req, res, next) {
    var usertoken = await localStorage.getItem("usertoken");
    try {
        if (req.session.userID) {
            var decoded = await jwt.verify(usertoken, "logintoken");
        } else {
            res.redirect("/login");
        }
    } catch (err) {
        res.redirect("/login");
    }
    next();
}
router.use(express.urlencoded({ extended: true }));

//Get Submission

// diskstorage multer function
var Storage = multer.diskStorage({
    destination: "./public/upload/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
    },
});

// middle ware for multer
var upload = multer({ storage: Storage }).single("file");

// function for finding data from our data base
var blogshow = blogModule.find({});

router.post("/submission", upload, (req, res) => {
    var author = req.session.userID;
    var email = req.session.userEMAIL;
    var title = req.body.Blog_title;
    var desc = req.body.Blog_desc;
    var content = req.body.Blog_content;
    var image = req.file.filename;

    var Blog = new blogModule({
        author: author,
        title: title,
        desc: desc,
        body: content,
        image: image,
        email:email,
    });
    Blog.save((err, doc) => {
        if (err) throw err;
        res.redirect('/submission')
        // res.render("submission", {
        //     title: "Submitted",
        //     msg: "Your Blog has been submitted",
        //     userdetails: req.session.userID,
        //     email :email ,
        // });
    });
});

router.post("/amend/:id", upload, async function (req, res, next) {
    var author = req.session.userID;
    var title = req.body.Blog_title;
    var desc = req.body.Blog_desc;
    var content = req.body.Blog_content;

    if (req.body.updateimage == 1) {
        var image = req.file.filename;
    } else {
        image = req.body.previousimage;
    }

    try {
        var update = await blogModule.findById(req.params.id);
        update.title = title;
        update.desc = desc;
        update.body = content;
        update.image = image;
        await update.save();

        res.redirect('/submission')
     
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
