const express = require("express");
const router = express.Router();

const authController = require("./controller");

router.post("/", (req, res) => {
  authController
    .login(req.body)
    .then(userInfo => {
      req.session.userInfo = userInfo;
      res.send(userInfo);
    })
    .catch(error => console.error(error));
});

router.get("/", (req, res) => {
  res.send(req.session.userInfo);
}); 

router.delete("/", (req, res) => {
  req.session.destroy();
  res.send("Logged out");
});

module.exports = router;
