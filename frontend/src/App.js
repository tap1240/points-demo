import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Balances from "./pages/Balances";
import Home from "./pages/Home";
import Spend from "./pages/Spend";
import Transaction from "./pages/Transaction";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/balances" element={<Balances />} />
        <Route exact path="/tx" element={<Transaction />} />
        <Route exact path="/spend" element={<Spend />} />
      </Routes>
    </Router>
  );
};

export default App;
