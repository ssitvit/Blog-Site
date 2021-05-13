var express = require('express');
var router = express.Router();

//Get Submission
router.get('/submission', function(req, res, next) {
    res.render('submission', { title: 'Submission' });
});




module.exports = router;