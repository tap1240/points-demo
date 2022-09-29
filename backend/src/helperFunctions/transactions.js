const fs = require("fs");

// reads transactions from /data/transactions.json
function getAllTx() {
  let transactions = fs.readFileSync("./src/data/transactions.json");

  // if file is empty, return empty array
  if (transactions.length === 0) {
    return [];
  }

  transactions = JSON.parse(transactions);
  // sort transactions by timestamp
  transactions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  return transactions;
}

// writes transaction to /data/transactions.json
function addTx(transaction) {
  const transactions = getAllTx();
  transactions.push(transaction);

  fs.writeFileSync(
    "./src/data/transactions.json",
    JSON.stringify(transactions, null, 2)
  );
  return transactions;
}

module.exports = { getAllTx, addTx };
