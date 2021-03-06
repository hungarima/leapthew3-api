const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const config = require("./config-production.json");
const cors = require("cors");

var app = express();

var acceptDomain = process.env.DEV ? "http://localhost:3000/" : "https://leapthew3-webapp.herokuapp.com";
console.log(acceptDomain);
app.use(cors({ 
  origin: ["https://leapthew3-webapp.herokuapp.com", 'http://localhost:3000/'],
  credentials: true
 }))

const userRouter = require("./modules/api/users/router");
const authRouter = require("./modules/api/auth/router");
const urlRouter = require("./modules/api/url/router");

app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "ALLOWALL");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, DELETE, OPTIONS"
  );

  const acceptedOrigins = ["http://localhost:3000","http://localhost:6969", "https://leapthew3-api.herokuapp.com"];
  if(req.headers.origin && acceptedOrigins.includes(req.headers.origin)) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", true);  

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
})



app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.secureCookie,
      maxAge: 12 * 60 * 60 * 1000
    }
  })
);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/url", urlRouter);


app.use(express.static('./public'));

app.get('/', function(req, res) {
  res.send('Leap The W3');
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
