import React from 'react';
import './assets/styles/Topbar.css'; // Optional: CSS for Topbar

const Topbar = ({ user, handleSignOut }) => {
  return (
    <div className="topbar">
      <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
      <h2>Welcome, {user.displayName}</h2>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Topbar;
