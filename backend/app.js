const express = require("express");
const cors = require("cors");
const app = express();

// middleware to parse the body of the request into a JSON object
app.use(express.json());

// middleware to allow cross-origin requests
app.use(cors());

// import routes
const homeRoute = require("./src/routes/home");
const balanceRoutes = require("./src/routes/balance");
const txRoutes = require("./src/routes/transactions");

// use the imported routes
app.use("/", homeRoute);
app.use("/", balanceRoutes);
app.use("/", txRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`~~~ Server running on port ${PORT} ~~~`);
});
