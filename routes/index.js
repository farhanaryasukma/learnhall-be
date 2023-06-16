var express = require('express');
var router = express.Router();
require('dotenv').config();


const test = process.env.PORT


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(`Express Server on port ${test}`);
});

module.exports = router;
