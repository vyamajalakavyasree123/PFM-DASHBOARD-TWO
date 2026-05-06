import React from "react";
import NavBar from "./NavBar";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import ConnectBank from "./ConnectBank";
import TransactionList from "./TransactionList";
import Summary from "./Summary";
import Accounts from "./Accounts";
import BarChartComponent from "./BarChartComponent";
import PieChartComponent from "./PieChartComponent";

function Dashboard(){
     const [monthlyData, setMonthlyData] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/monthly-summary", {
      params: { email: localStorage.getItem("email") }
    })
    .then(res => {
      console.log("Monthly Data:", res.data);
      setMonthlyData(res.data);
    })
    .catch(err => console.log(err));
  }, []);

return (
  <div className="dashboard">

  <NavBar/>   {/* sidebar */}

  <div className="dashboard-content">

    <Summary/>

    <div className="charts-wrapper">
  <div style={{ width: "400px", height: 300 }}>
    <BarChartComponent data={monthlyData} />
  </div>

  <div style={{ width: "350px" }}>
    <PieChartComponent data={monthlyData} />
  </div>
</div>

    <TransactionList/>

    <ConnectBank/>

  </div>

</div>
);
}
export default Dashboard;