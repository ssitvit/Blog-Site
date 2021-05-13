var express = require('express');
var router = express.Router();

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


//Get Submission
router.get('/submission',checkLoginuser, function(req, res, next) {
    res.render('submission', { title: 'Submission' });
});




module.exports = router;