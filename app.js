require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const port = process.env.PORT || 3000;

const apiRouter = require("./routes/api");
const indexRouter = require("./routes/index");

const app = express();

app.use(
  cors({
    origin: ["https://everymanenglish.com", "http://localhost:3000"],
    optionsSuccessStatus: 200,
    methods: ["POST"],
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", apiRouter);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error"); // Add this line to render the error page
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
