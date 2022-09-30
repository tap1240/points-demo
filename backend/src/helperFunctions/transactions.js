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

  // ensure points and pointsRemaining are integers
  transaction.points = Number(transaction.points);
  transaction.pointsRemaining = transaction.points;

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
  const updatedTransactions = transactions;

  // get user balance
  const user = fs.readFileSync("./src/data/user.json");
  const userData = JSON.parse(user);
  const balance = userData.points;

  // if user doesn't have enough points, return error
  if (balance < points) {
    return { error: "insufficient points" };
  }

  // subtract points from user balance and update user.json
  userData.points -= points;
  fs.writeFileSync("./src/data/user.json", JSON.stringify(userData, null, 2));

  // loop through transactions and subtract points from oldest transactions until points = 0
  transactions.forEach((tx) => {
    if (points === 0) {
      return;
    }

    // skip transactions that have already been spent
    if (tx.spent) {
      return;
    }

    // This posed a weird situation. The initial example provides a tx with negative points.
    // It seems that this should be a spent tx, but the example indidcates that these points should
    // be accounted for when looping through the transactions to determine balances. To avoid looping
    // over the same tx, I added a spent field and remaining points to the tx object so as to retain
    // the original amount for future reporting.

    const payerObj = spend.find((obj) => obj.payer === tx.payer);

    // if payerObj exists, add points to it
    if (payerObj) {
      // tx has enough points to cover points remaining
      if (tx.pointsRemaining > points) {
        payerObj.points -= points;
        tx.pointsRemaining -= points;
        points = 0;
      }
      // tx cannot cover remaining points
      else {
        payerObj.points -= tx.points;
        tx.pointsRemaining = 0;
        tx.spent = true;
        points -= tx.points;
      }
    }
    // if payerObj doesn't exist, create it
    else {
      // tx has enough points to cover points remaining
      if (tx.pointsRemaining > points) {
        spend.push({ payer: tx.payer, points: -points });
        tx.pointsRemaining -= points;
        points = 0;
      }
      // tx cannot cover remaining points
      else {
        spend.push({ payer: tx.payer, points: -tx.points });
        tx.pointsRemaining = 0;
        tx.spent = true;
        points -= tx.points;
      }
    }

    // find tx by id and update it
    const index = updatedTransactions.findIndex((obj) => obj.id === tx.id);
    updatedTransactions[index] = tx;
  });

  // update transactions.json
  fs.writeFileSync(
    "./src/data/transactions.json",
    JSON.stringify(updatedTransactions, null, 2)
  );

  // *** becomes redundant after adding pointsRemaining and spent fields to tx object
  // could be a talking point on how to handle this situation
  
  // add spend transactions for each payer in spend array
  // spend.forEach((obj) => {
  //   const spendTx = {
  //     id: uuidv4(),
  //     payer: obj.payer,
  //     points: obj.points,
  //     timestamp: new Date(),
  //   };
  //   addTx(spendTx);
  // });

  return spend;
}

module.exports = { getAllTx, addTx, spendPoints };
