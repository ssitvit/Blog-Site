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
    var title = req.body.Blog_title;
    var desc = req.body.Blog_desc;
    var content = req.body.Blog_content;
    // var usertoken = req.session.userID;
    var image = req.file.filename;

    var Blog = new blogModule({
        author: author,
        title: title,
        desc: desc,
        body: content,
        image: image,
    });
    Blog.save((err, doc) => {
        if (err) throw err;
        res.render("submission", {
            title: "Submitted",
            msg: "Your Blog has been submitted",
            userdetails: req.session.userID,
        });
    });
});

router.post("/amend/:id", upload, async function (req, res, next) {
    var author = req.session.userID;
    var title = req.body.Blog_title;
    var desc = req.body.Blog_desc;
    var content = req.body.Blog_content;
    // console.log(content);
    // var usertoken = req.session.userID;
    // console.log("this is image"+ req.body.updateimage);
    if (req.body.updateimage == 1) {
        var image = req.file.filename;
    } else {
        image = req.body.previousimage;
    }

    // console.log("show file name" + req.body.previousimage);
    // console.log(req.params.id);

    try {
        var update = await blogModule.findById(req.params.id);
        update.title = title;
        update.desc = desc;
        update.body = content;
        update.image = image;
        await update.save();

        res.render("submission", {
            title: "Submission",
            msg: "Blog edited succesfully",
            userdetails:req.session.userID,
        });
        // var update = blogModule.findByIdAndUpdate(
        //     req.params.id,
        //     {
        //         author: usertoken,
        //         title: title,
        //         desc: desc,
        //         body: content,
        //         image: image,
        //     },
        //     { runValidators: true }
        // );
        // update.exec(function (err, data) {
        //     if (err) throw err;

        // });
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
