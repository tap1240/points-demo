const fs = require("fs");

// reads and sorts transactions from /data/transactions.json
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

  if (!transaction.timestamp) {
    transaction.timestamp = new Date();
  }

  transactions.push(transaction);

  // add tx to transactions.json
  fs.writeFileSync(
    "./src/data/transactions.json",
    JSON.stringify(transactions, null, 2)
  );

  // add points to user.json
  const user = fs.readFileSync("./src/data/user.json");
  let userData = {};
  if (user.length === 0) {
    userData.points = 0;
  } else {
    userData = JSON.parse(user);
  }
  userData.points += Number(transaction.points);
  fs.writeFileSync("./src/data/user.json", JSON.stringify(userData, null, 2));

  return transactions;
}

// spends points from transactions
// returns
function spendPoints(transactions, points) {
  const spend = {};

  // get user balance
  const user = fs.readFileSync("./src/data/user.json");
  const userData = JSON.parse(user);
  const balance = userData.points;

  // if user doesn't have enough points, return error
  if (balance < points) {
    return { error: "insufficient points" };
  }

  // loop through transactions and subtract points from oldest transactions
  // until points = 0
  transactions.forEach((tx) => {
    if (points === 0) {
      return;
    }

    // get amount of points payer has already spent, if none, set to 0
    let oldPoints = spend[tx.payer] ? spend[tx.payer] : 0;

    // this tx has enough points to cover remaining points
    if (tx.points > points) {
      oldPoints -= points;
      points = 0;
    }
    // this tx doesn't have enough points to cover remaining points
    else {
      oldPoints -= tx.points;
      points -= tx.points;
    }

    // update spend object
    spend[tx.payer] = oldPoints;
  });

  console.log(spend);
  return spend;
}

module.exports = { getAllTx, addTx, spendPoints };
