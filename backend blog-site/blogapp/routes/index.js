var express = require("express");
var router = express.Router();
// schema external module link
var userModule = require("../modules/blog");
var blogModule = require("../modules/blog_sub");

// web token module
var jwt = require("jsonwebtoken");

// for dynamic showing of data
const moment = require("moment");

// checking user is login or not in a function
function checkLoginuser(req, res, next) {
  var usertoken = localStorage.getItem("usertoken");
  try {
    var decoded = jwt.verify(usertoken, "logintoken");
  } catch (err) {
    res.render("login", {
      title: "Login Page",
      msg: "Login first",
    });
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
var blogshow = blogModule.find({});

/* GET home page. */

router.get("/", function (req, res, next) {
  blogshow.exec(function (err, data) {
    if (err) throw err;

    res.render("blog", {
      title: "Employee records",
      records: data,
    });
  });
  // res.render('blog', { title: 'Express' });
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Express", msg: "" });
});
router.get("/signup", function (req, res, next) {
  res.render("signup", { title: "Express", msg: "" });
});
router.get("/logout", function (req, res, next) {
  res.render("logout", {});
});

router.get("/submission", checkLoginuser, function (req, res, next) {
  var usertoken = localStorage.getItem("loginuser");
  res.render("submission", {
    title: "Submission",
    userdetails: usertoken,
    msg: "",
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
router.post("/login",checkuserexist, function (req, res, next) {
  var loginuser = req.body.Username;
  var loginpass = req.body.Password;

  // console.log(loginpass+loginuser);

  var checkuser = userModule.findOne({ username: loginuser });
  console.log(checkuser.getOptions);
  checkuser.exec((err, data) => {
    if (err) {console.log("fir error agya")}
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
router.post("/readmore/:id", function (req, res, next) {
  console.log(req.params.id);
  console.log(req.params);
  var blogsingle = blogModule.find({_id:req.params.id});
  blogsingle.exec(function (err, data) {
    if (err) throw err;

    res.render("singleblog", {
      title: "Employee records",
      records: data,
    });
  });
  // res.render("logout", {});
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
