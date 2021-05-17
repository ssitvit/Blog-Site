var express = require("express");
var router = express.Router();
// schema external module link
var userModule = require("../modules/blog");
var blogModule = require("../modules/blog_sub");
// mailer for subscription
var nodemailer = require("nodemailer");
// web token module
var jwt = require("jsonwebtoken");

// for dynamic showing of data
const moment = require("moment");
const blogmodel = require("../modules/blog");

// checking user is login or not in a function
async function checkLoginuser(req, res, next) {
    var usertoken = await localStorage.getItem("usertoken");
    try {
        var decoded = await jwt.verify(usertoken, "logintoken");
    } catch (err) {
        res.redirect("/login");
    }
    next();
}

// local storage
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
}

// checking user already defined
function checkuser(req, res, next) {
    var username = req.body.Username;
    var checkexituser = userModule.findOne({ username: username });

    checkexituser.exec((err, data) => {
        if (err) throw err;
        if (data) {
            return res.render("signup", {
                msg: "User Already Exists",
            });
        }
        next();
    });
}
// checking useremail already defined
function checkemail(req, res, next) {
    var useremail = req.body.Useremail;
    var checkexitemail = userModule.findOne({ email: useremail });
    checkexitemail.exec((err, data) => {
        if (err) throw err;
        if (data) {
            return res.render("signup", {
                msg: "Email Already Exists",
            });
        }
        next();
    });
}
//checking user exists or not
function checkuserexist(req, res, next) {
    var username = req.body.Username;
    var checkexituser = userModule.findOne({ username: username });

    checkexituser.exec((err, data) => {
        if (err) throw err;
        if (!data) {
            return res.render("login", {
                msg: "User not exists",
            });
        }
        next();
    });
}

// function for finding data from our data base

/* GET home page. */

router.get("/", function (req, res, next) {
    var blogshow = blogModule.find().sort({ createdAt: -1 }).limit(2).skip(0);
    var skip = 2;
    blogshow.exec(function (err, data) {
        if (err) throw err;

        res.render("blog", {
            title: "",
            records: data,
            skip: skip,
        });
    });
    // res.render('blog', { title: 'Express' });
});
// getting limited data in page method
router.get("/main/:Id", function (req, res, next) {
    var y = req.params.Id;
    skip = parseInt(y);

    var blogshow = blogModule.find().sort({ createdAt: -1 }).limit(2).skip(skip);
    skip = skip + 2;
    blogshow.exec(function (err, data) {
        if (err) throw err;

        res.render("blog", {
            title: "",
            records: data,
            skip: skip,
        });
    });
});

router.get("/login", function (req, res, next) {
    res.render("login", { title: "Express", msg: "Login First" });
});
router.get("/edit/:id", checkLoginuser, function (req, res, next) {
    console.log("this is being sent to backend" + req.params.id);

    var blogsearch = blogModule.find({ author: req.params.id });
    blogsearch.exec(function (err, data) {
        // console.log("data coming from backend "+data);
        if (err) throw err;
        res.render("search", { title: "Express", records: data, msg: "" });
    });

    // res.render("login", { title: "Express", msg: "" });
});
router.get("/signup", function (req, res, next) {
    res.render("signup", { title: "Express", msg: "" });
});
// router.get("/search", function (req, res, next) {
//   res.render("search", { title: "Express", msg: "" });
// });
router.get("/logout", function (req, res, next) {
    res.render("logout", {});
});

router.get("/submission", checkLoginuser, async function (req, res, next) {
    var usertoken = localStorage.getItem("loginuser");
    res.render("submission", {
        title: "Submission",
        userdetails: usertoken,
        msg: "",
    });
});

// delete method for deleting our blog
router.get("/delete/:id", checkLoginuser, async function (req, res, next) {
    console.log(req.params.id);
    var usertoken = localStorage.getItem("loginuser");
    await blogModule.findByIdAndDelete(req.params.id);
    res.render("submission", {
        title: "Submission",
        userdetails: usertoken,
        msg: "Blog deleted",
    });
});
//change method
router.get("/change/:id", checkLoginuser, async function (req, res, next) {
    console.log(req.params.id);
    var usertoken = localStorage.getItem("loginuser");
    var change = blogModule.findById(req.params.id);
    change.exec((err, data) => {
        if (err) throw err;
        res.render("edit", {
            title: "Submission",
            userdetails: usertoken,
            msg: "Edit your blog",
            records: data,
        });
    });
});

// post method for storing data from signup page
router.post("/signup", checkuser, checkemail, function (req, res, next) {
    var username = req.body.Username;
    var useremail = req.body.Useremail;
    var password = req.body.Password;
    var confirmpassword = req.body.ConPassword;
    // console.log(useremail+username+password);

    // checking confirm pass matches with passowrd
    if (password != confirmpassword) {
        res.render("signup", {
            title: "SIGNUP FORM",
            msg: "Password and confirm pasword does not matched",
        });
    } else {
        var userdetails = new userModule({
            username: username,
            email: useremail,
            password: password,
        });
        userdetails.save((err, doc) => {
            if (err) throw err;
            res.render("signup", {
                title: "SIGNUP FORM",
                msg: "User registered succesfully",
            });
        });
    }

    // res.render('signup', { title: 'Express' });
});

// login page post method
router.post("/login", checkuserexist, function (req, res, next) {
    var loginuser = req.body.Username;
    var loginpass = req.body.Password;

    // console.log(loginpass+loginuser);

    var checkuser = userModule.findOne({ username: loginuser });
    console.log(checkuser.getOptions);
    checkuser.exec((err, data) => {
        if (err) {
            console.log("fir error agya");
        }
        console.log(data.username);
        // if(data.username=null){
        //   res.redirect("/signup")
        // }else{
        var getpassword = data.password;
        var getid = data._id;
        // console.log(data);

        if (loginpass == getpassword) {
            var token = jwt.sign({ userID: getid }, "logintoken");
            // storing token in local storage
            localStorage.setItem("usertoken", token);
            localStorage.setItem("loginuser", loginuser);

            res.redirect("/submission");
        } else {
            res.render("login", {
                title: "Login Page",
                msg: "Invalid username and password",
            });
        }
        //  }
    });

    // res.render('login', { title: 'Express' });
});

// readmore function redirect
router.get("/readmore/:id", function (req, res, next) {
    console.log(req.params.id);
    console.log(req.params);
    var blogsingle = blogModule.find({ _id: req.params.id });
    blogsingle.exec(function (err, data) {
        if (err) throw err;
        // console.log("this is data sent to readmore"+data)
        res.render("singleblog", {
            title: "Employee records",
            records: data,
        });
    });
    // res.render("logout", {});
});

// search functionality
router.post("/search", async function (req, res, next) {
    var search = req.body.search;

    // var blogsearch = blogModule.find( { author:search } );
    // blogModule.createIndex( { title: "text" } );

    var blogsearch = blogModule.find({
        $text: { $search: search, $caseSensitive: false },
    });
    blogsearch.exec(function (err, data) {
        // console.log("data coming from backend "+data);
        if (err) throw err;
        res.render("search1", { title: "Express", records: data, msg: "" });
    });
});

// mailer
router.post("/mailer", function (req, res, next) {
    var mail = req.body.mail;
    console.log(mail);
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ganiiscool@gmail.com",
            pass: "xdjcrasbbxsdwyua",
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    var mailOptions = {
        from: "ganiiscool@gmail.com",
        to: "mail",
        subject: "You have just subscribed to IEEE SSIT VIT Blogs",
        text: "That was easy!",
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.redirect("/");
        } else {
            console.log("Email sent: " + info.response);
            res.redirect("/");
        }
    });
});

// logout method
router.post("/logout", function (req, res, next) {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("loginuser");
    res.render("login", {
        title: "Login Page",
        msg: "Login To submit blog",
    });
});
module.exports = router;
