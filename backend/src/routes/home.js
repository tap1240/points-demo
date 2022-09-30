const express = require("express");
const router = express.Router();

const fs = require("fs");

router.get("/", (req, res) => {
  const userData = getUserData();
  res.send(JSON.stringify(userData, null, 2));
});

// get userObj user.json
function getUserData() {
  const user = fs.readFileSync("./src/data/user.json");
  const userData = JSON.parse(user);
  return userData;
}

module.exports = router;
