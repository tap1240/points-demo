const fs = require("fs");
const uuidv4 = require("uuid").v4;

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
// returns array of dictionaries of payers and how many points were spent from each
// format of spend array:
// [{payer: (string), points: (integer)}]
function spendPoints(transactions, points) {
  const spend = [];

  // get user balance
  const user = fs.readFileSync("./src/data/user.json");
  const userData = JSON.parse(user);
  const balance = userData.points;

  // if user doesn't have enough points, return error
  if (balance < points) {
    return { error: "insufficient points" };
  }

  // loop through transactions and subtract points from oldest transactions until points = 0
  transactions.forEach((tx) => {
    if (points === 0) {
      return;
    }

    const payerObj = spend.find((obj) => obj.payer === tx.payer);

    // if payerObj exists, add points to it
    if (payerObj) {
      if (tx.points > points) {
        payerObj.points -= points;
        points = 0;
      } else {
        payerObj.points -= tx.points;
        points -= tx.points;
      }
    } else {
      // if payerObj doesn't exist, create it
      if (tx.points > points) {
        spend.push({ payer: tx.payer, points: -points });
        points = 0;
      } else {
        spend.push({ payer: tx.payer, points: -tx.points });
        points -= tx.points;
      }
    }
  });

  // add spend transactions for each payer in spend array
  spend.forEach((obj) => {
    const spendTx = {
      id: uuidv4(),
      payer: obj.payer,
      points: obj.points,
      timestamp: new Date(),
    };
    addTx(spendTx);
  });

  return spend;
}

module.exports = { getAllTx, addTx, spendPoints };
