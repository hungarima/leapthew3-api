const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const config = require("./config-production.json");


var app = express();

const userRouter = require("./modules/api/users/router");
const authRouter = require("./modules/api/auth/router");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);


app.use(express.static('./public'));

app.get('/', function(req, res) {
  res.send('Leap The W3');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



mongoose.connect(config.mongoPath, err => {
  if (err) console.error(err);
  else console.log("Database connect successful");
});

const port = process.env.PORT || 6969;

app.listen(port, err => {
  if (err) console.log(err);
  console.log("Server started at port " + port);
});
