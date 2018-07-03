const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const config = require("./config-local.json");

const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));

app.get("/", (req, res) => {
  res.status(404).send("404 NOT FOUND");
});

mongoose.connect(config.mongoPath, err => {
  if (err) console.error(err);
  else console.log("Database connect successful");
});

const port = process.env.port || 6969;

app.listen(port, err => {
  if (err) console.log(err);
  console.log("Server started at port " + port);
});
