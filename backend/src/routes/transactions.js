const express = require("express");
const router = express.Router();
const { addTx, getAllTx } = require("../helperFunctions/transactions");
const uuidv4 = require("uuid").v4;

router.get("/tx/", (req, res) => {
  const transactions = getAllTx();
  res.send(JSON.stringify(transactions, null, 2));
});

// adds transaction to /data/transactions.json
// if no date is provided, the current date is used
// formart of transaction object:
// {payer: (string), points: (integer), timestamp: (date)}
router.post("/addTx/", (req, res) => {
  const { payer, points, timestamp } = req.body;
  const id = uuidv4();

  let date;
  if (!timestamp) {
    date = new Date();
  } else {
    date = new Date(timestamp);
  }

  const transaction = { id, payer, points, timestamp };
  const transactions = addTx(transaction);
  res.send(transactions);
});

module.exports = router;
