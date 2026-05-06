import React, { useEffect, useState } from "react";
import axios from "axios";
import PieChartComponent from "./PieChartComponent";
import "./Dashboard.css";

function Summary() {

  const [summary, setSummary] = useState(null);

  useEffect(() => {
axios.get("http://localhost:5000/transactions", {    
  params: { email: localStorage.getItem("email") }
  })
  .then(res => {
    console.log("API Response:", res.data); // 👈 ADD THIS
    setSummary(res.data);
  })
  .catch(err => {
    console.error("API Error:", err); // 👈 ADD THIS
  });
}, []);

  if (!summary) return <h3>Loading...</h3>;

  return (
    <div className="summary-container">

<h2>📊 Dashboard Summary</h2>
      <div className="cards">
        <div className="card income">
          <h3>Income</h3>
          <p>₹{summary.income}</p>  
        </div>

        <div className="card expense">
          <h3>Expense</h3>
          <p>₹{summary.expense}</p>
        </div>
      </div>

      <PieChartComponent data={summary.categories} />

    </div>
  );
}

export default Summary;