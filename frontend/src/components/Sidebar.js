// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Sidebar</h2>
      <nav>
        <ul>
          <li><Link to="/">Data</Link></li>
          <li><Link to="/analytics">Status</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;