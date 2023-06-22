var express = require("express");
var router = express.Router();
const mailer = require("../controller/mailer");

/* GET users listing. */
router.post("/book-session", mailer.addBookSession);
router.post("/new-tutor", mailer.addTutorRegistration);

module.exports = router;
