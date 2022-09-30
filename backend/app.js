const express = require("express");
const cors = require("cors");
const app = express();

// middleware to parse the body of the request into a JSON object
app.use(express.json());

// middleware to allow cross-origin requests
app.use(cors());

const fs = require("fs");

// import routes
const homeRoute = require("./src/routes/home");
const balanceRoutes = require("./src/routes/balance");
const txRoutes = require("./src/routes/transactions");

// use the imported routes
app.use("/", homeRoute);
app.use("/", balanceRoutes);
app.use("/", txRoutes);

const PORT = 3001;

// make sure src/data/transactions.json and src/data/user.json exist
function fileChecks() {
  if (!fs.existsSync("./src/data/transactions.json")) {
    console.log("creating transactions.json");
    fs.writeFileSync("./src/data/transactions.json", "[]");
  }

  if (!fs.existsSync("./src/data/user.json")) {
    console.log("creating user.json");
    fs.writeFileSync("./src/data/user.json", '{"points": 0}');
  }
}

app.listen(PORT, () => {
  console.log(`~~~ Server running on port ${PORT} ~~~`);
  fileChecks();
});
