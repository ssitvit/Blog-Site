var express = require('express');
var router = express.Router();

//Get Submission
router.get('/', function(req, res, next) {
    res.render('submission', { title: 'Submission' });
  });



router.get('/submitted', function(req, res, next) {
    res.render('submitted', { title: 'Submitted' });
  });

  module.exports = router;