import axios from "axios";
import { useState } from "react";
import "./Transactions.css";

function Transactions() {

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");

  const addTransaction = async () => {
    try {
      await axios.post("http://localhost:5000/add-transaction", {
        email: localStorage.getItem("email"),
        name: category,
        amount: Number(amount),
        type: type
      });

      alert("Transaction Added ✅");

      setAmount("");
      setCategory("");
      setType("expense");

    } catch (err) {
      console.log(err);
      alert("Error ❌");
    }
  };

  return (
    <div className="transaction-container">

      <h3>Add Transaction</h3>

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        placeholder="Category / Name"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <button onClick={addTransaction}>Add</button>

    </div>
    
  );
}

export default Transactions;