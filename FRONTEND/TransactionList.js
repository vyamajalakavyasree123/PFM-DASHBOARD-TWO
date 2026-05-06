import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function TransactionList() {

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/transactions", {
      params: { email: localStorage.getItem("email") }
    })
  .then(res => {
  setTransactions(res.data.transactions || []);
})
    .catch(err => {
      console.log(err);
    });
  }, []);

  return (
    <div className="transactions-container">
     {/* <h2>Recent Transactions</h2>*/}
 
      <div className="transactions-list">
        {Array.isArray(transactions) &&
  transactions.slice(0, 10).map((txn, index) => (
    <div className="transaction-card" key={index}>
      <h3>{txn.name}</h3>
       <p>₹{txn.amount}</p>
      <p>{txn.category}</p>
      <p>{txn.date}</p>
    </div>
))}
      </div>
    </div>
  );
}

export default TransactionList;