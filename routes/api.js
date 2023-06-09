var express = require('express');
var router = express.Router();
const main = require("../controller/mailer")

/* GET users listing. */
router.post('/submit-tutoring-form', main);

module.exports = router;
