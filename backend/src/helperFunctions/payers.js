function getBalance(transactions, id = null) {
  const balances = {};
  transactions.forEach((tx) => {
    // if id is provided, only return balance of that payer
    if (id && tx.payer !== id) {
      return;
    }

    if (balances[tx.payer]) {
      balances[tx.payer] += tx.pointsRemaining;
    } else {
      balances[tx.payer] = tx.pointsRemaining;
    }
  });

  return balances;
}

module.exports = { getBalance };
