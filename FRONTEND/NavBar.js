import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./NavBar.css";

function NavBar() {

  const navigate = useNavigate();
  const email = localStorage.getItem("email"); // check login

  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <nav className="sidebar">

  <div className="sidebar-top">
    <h3 className="logo">💰 Finance</h3>
  </div>

  <ul className="sidebar-menu">

    {!email ? (
      <>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </>
    ) : (
      <>
        <li><Link to="/dashboard">🏠 Dashboard</Link></li>
        <li><Link to="/transactions">💸 Transactions</Link></li>
        <li><Link to="/accounts">🏦 Accounts</Link></li>

        <li>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </li>
      </>
    )}

  </ul>

</nav>
    );
}

export default NavBar;