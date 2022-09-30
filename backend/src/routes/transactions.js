const express = require("express");
const router = express.Router();
const {
  addTx,
  getAllTx,
  spendPoints,
} = require("../helperFunctions/transactions");
const uuidv4 = require("uuid").v4;

router.get("/tx", (req, res) => {
  const transactions = getAllTx();
  res.send(JSON.stringify(transactions, null, 2));
});

// adds transaction to /data/transactions.json
// if no timestamp is provided, the current date is used
// formart of transaction object:
// {id: (string), payer: (string), points: (integer), timestamp: (string)}
router.post("/addTx", (req, res) => {
  const { payer, points, timestamp } = req.body;
  const id = uuidv4();

  const transaction = { id, payer, points, timestamp };
  const transactions = addTx(transaction);
  res.send(transactions);
});

router.post("/spend", (req, res) => {
  const { points } = req.body;
  const transactions = getAllTx();
  const spend = spendPoints(transactions, points);
  res.send(spend);
});

// ----------------------------------------------------------------------------

// see comments for /tx/ route
router.get("/addTxManual", (req, res) => {
  console.log(req.body);
  if (!req.query.payer || !req.query.points) {
    res.send("missing parameters");
    return;
  }

  const { payer, points, timestamp } = req.query;
  const id = uuidv4();
  const transaction = { id, payer, points, timestamp };

  addTx(transaction);

  const response = `added transaction successfully: ${JSON.stringify(
    transaction,
    null,
    2
  )}`;
  res.send(response);
});

module.exports = router;
