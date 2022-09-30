import React, { useEffect, useState } from "react";

export default function Balances() {
  const [balances, setBalances] = useState(null);

  // fetch the data from the backend when the component loads
  useEffect(() => {
    getBalances();
  }, []);

  const getBalances = async () => {
    try {
      const response = await fetch("http://localhost:3001/balance");
      const jsonData = await response.json();
      setBalances(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const renderBalances = () => {
    return Object.keys(balances).map((payer) => {
      return (
        <tr key={payer}>
          <td>{payer}</td>
          <td style={{ paddingLeft: 75 }}>{balances[payer]}</td>
        </tr>
      );
    });
  };

  return (
    <div className="center">
      <div>
        <h1>Payer Balances</h1>
        {/* <button onClick={getBalances}>Get Balances</button> */}
        {balances ? renderBalances() : null}
      </div>
    </div>
  );
}
