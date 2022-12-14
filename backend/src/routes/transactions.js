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
  if (!payer || !points) {
    res.send("missing parameters");
    return;
  }
  const id = uuidv4();

  const transaction = { id, payer, points, pointsRemaining: points, timestamp };
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
  if (!req.query.payer || !req.query.points) {
    res.send("missing parameters");
    return;
  }

  const { payer, points, timestamp } = req.query;
  const id = uuidv4();
  const transaction = { id, payer, points, pointsRemaining: points, timestamp };

  addTx(transaction);

  const response = `added transaction successfully: ${JSON.stringify(
    transaction,
    null,
    2
  )}`;
  res.send(response);
});

router.get("/spendManual", (req, res) => {
  if (!req.query.points) {
    res.send("missing parameters");
    return;
  }
  const { points } = req.query;
  const transactions = getAllTx();
  const spend = spendPoints(transactions, points);
  res.send(JSON.stringify(spend, null, 2));
});

module.exports = router;
