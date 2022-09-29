const express = require("express");
const router = express.Router();

const { getBalance } = require("../helperFunctions/payers");
const { getAllTx } = require("../helperFunctions/transactions");

// return all payer point balances
// return balance of a specific payer if id is provided
router.get("/payers/:id?", (req, res) => {
  const id = req.params.id;

  const transactions = getAllTx();
  const balances = getBalance(transactions, id);

  res.send(JSON.stringify(balances, null, 2));
});

module.exports = router;
