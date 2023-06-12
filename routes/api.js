var express = require('express');
var router = express.Router();
const mail = require("../controller/mailer")

/* GET users listing. */
router.post('/book-session', mail);

module.exports = router;
