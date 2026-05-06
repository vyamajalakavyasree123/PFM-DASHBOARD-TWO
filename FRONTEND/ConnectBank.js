import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import "./ConnectBank.css";

function ConnectBank() {

  const [linkToken, setLinkToken] = useState(null);

  useEffect(() => {
    axios.post("http://localhost:5000/create_link_token")
      .then(res => {
         console.log(res.data); // ADD THIS
        setLinkToken(res.data.link_token);
      });
  }, []);

 const { open, ready } = usePlaidLink({
  token: linkToken || "",
  onSuccess: async (public_token) => {
    try {
      const res = await axios.post("http://localhost:5000/exchange_public_token", {
        public_token,
        email: localStorage.getItem("email")
      });

      console.log("success", res.data);
      alert("Bank Connected");

    } catch (error) {
      console.error("ERROR:", error.response?.data || error.message);
      alert("Bank connection failed ❌");
    }
  }
}); // ✅ THIS WAS MISSING
  return (
    <div className="connect-container">
    <button className="connect-btn" onClick={() => {
  if (ready) open();
  else alert("Plaid not ready");
}} disabled={false}>
      Connect Bank
    </button>
    </div>
  );
}

export default ConnectBank;