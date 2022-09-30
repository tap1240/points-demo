import React, { useState } from "react";

export default function Spend() {
  const [points, setPoints] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    spendPoints(points);
    handleClose();
  };

  const handleClose = () => {
    setPoints("");
  };

  const spendPoints = async (points) => {
    try {
      const body = { points };
      const response = await fetch("http://localhost:3001/spend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();
      console.log(JSON.stringify(jsonData, null, 2));
      if (jsonData.error) {
        alert(jsonData.error);
      }
      // alert(JSON.stringify(jsonData, null, 2));
      // navigate home
      // window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="center">
      <form onSubmit={handleSubmit}>
        <label className="label">Points to Spend</label>
        <input
          type="number"
          id="points"
          name="points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          required
        />
        <br />
        <button style={{ marginLeft: 120 }} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
