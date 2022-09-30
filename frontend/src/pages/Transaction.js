import React, { useState } from "react";

export default function Transaction() {
  const [payer, setPayer] = useState("");
  const [points, setPoints] = useState("");
  const [timestamp, setTimestamp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addTransaction(payer, points, timestamp);
    handleClose();
  };

  const handleClose = () => {
    setPayer("");
    setPoints("");
    setTimestamp("");
  };

  const addTransaction = async (payer, points, timestamp) => {
    try {
      // ensure timestamp is in the correct format
      let formattedDate;
      if (timestamp) {
        const date = new Date(timestamp);
        formattedDate = date.toISOString();
      } else {
        const date = new Date();
        formattedDate = date.toISOString();
      }

      const body = { payer, points, timestamp: formattedDate };
      await fetch("http://localhost:3001/addtx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="center">
      <div className="center-block">
        <form onSubmit={handleSubmit}>
          <label className="label">Payer</label>
          <input
            type="text"
            id="payer"
            name="payer"
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
            required
          />
          <br />
          <label className="label">Points</label>
          <input
            type="number"
            id="points"
            name="points"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            required
          />
          <br />
          <label className="label">Timestamp*</label>
          <input
            type="text"
            id="timestamp"
            name="timestamp"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
          />
          <br />
          <button className="btn" type="submit">
            Submit
          </button>
        </form>
        <div style={{ fontSize: 10 }}>
          *Can take date or timestamp. If left blank, current time will be used{" "}
        </div>
      </div>
    </div>
  );
}
