// src/pages/Dashboard.js
import React from 'react';

function Dashboard() {
  return (
    <div className="dashboard">
      <h2>Main Dashboard</h2>
      <div className="cards">
        <div className="card">Total Users: 500</div>
        <div className="card">Active Sessions: 120</div>
        <div className="card">Monthly Revenue: $12,000</div>
      </div>
    </div>
  );
}

export default Dashboard;