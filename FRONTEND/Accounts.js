import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Accounts.css";

function Accounts() {

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/accounts", {
          params: {
            email: localStorage.getItem("email")
          }
        });

        console.log(res.data);
        setAccounts(res.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div className="accounts-container">
  <h2 className="title">My Bank Accounts</h2>

  <div className="accounts-flex">
    {accounts.map((acc, index) => (
      <div className="account-card" key={index}>
        <h3>{acc.name}</h3>
        <p className="type">{acc.type}</p>

        <div className="balance">
          ${acc.balances.current}
        </div>
      </div>
    ))}
  </div>
</div>
  );
}

export default Accounts;