import React, { useState } from 'react';
import { signOut } from 'firebase/auth'; 
import { auth } from '../firebase'; 
import { useNavigate } from 'react-router-dom'; 
import logo from './assets/images/logo.png'
import './assets/styles/Home.css'; 
import './assets/styles/Sidebar.css'; 
import './assets/styles/Topbar.css'; 
import './assets/styles/Page2.css';

const Sidebar = ({ onClick }) => {
  return (
    <div className="sidebar">
      <div className='sidebar-image'>
        <img src={logo}  alt='vendy' width={80}  />
        <span>Vendy</span>
      </div>
      <h2>Dashboard</h2>
      <nav>
        <ul>
          <li onClick={() => onClick("Dashboard Info")}>Help</li>
          <li onClick={() => onClick("Employee Info")}>Employee Info</li>
          <li onClick={() => onClick("Status")}>Status</li> {/* Changed from Analytics to Status */}
          <li onClick={() => onClick("Settings Info")}>Settings</li>
          <li onClick={() => onClick("Invoice Management")}>Manage Invoices</li>
          <li onClick={() => onClick("Profile Info")}>Profile</li>
        </ul>
      </nav>
    </div>
  );
};

const Topbar = ({ user, handleSignOut }) => {
  return (
    <div className="topbar">
      <div>
         <h2>Welcome, {user.displayName}!</h2>
      </div>
      <div className='topbar-img'>
         <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
    
         <button onClick={handleSignOut}>Sign Out</button>
      </div>
     
    </div>
  );
};

const Home = ({ user }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        navigate('/');
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  const handleSidebarClick = (content) => {
    if (content === "Invoice Management") {
      navigate('/invoice-management'); // Updated the path to match the route in App.js
    } else {
      setPopupContent(content);
      setPopupVisible(true);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
    setPopupContent("");
  };

  const statusStages = [
    { id: 'INV001', businessName: 'Tech Solutions Inc.',date:"09.01.2001" ,status: 'Pending' },
    { id: 'INV002', businessName: 'Creative Co.',date:"13.03.2006" , status: 'More Info Required' },
    { id: 'INV003', businessName: 'Retail Supplies',date:"03.03.2012" , status: 'Approved' },
    { id: 'INV004', businessName: 'Marketing Plus',date:"26.08.2021" ,  status: 'Rejected' },
    { id: 'INV005', businessName: 'Tech Solutions Inc.',date:"22.10.2023" ,status: 'Pending' },
    { id: 'INV007', businessName: 'Retail Supplies',date:"10.09.2012" , status: 'Approved' },
  ];
  
  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#FFA500'; // Orange for Pending
      case 'More Info Required':
        return '#0074A3'; // Blue for More Info Required
      case 'Approved':
        return '#52B80E'; // Green for Approved
      case 'Rejected':
        return '#F46B5B'; // Red for Rejected
      default:
        return '#888888'; // Default color
    }
  };
  
  return (
    <div className="home-container">
      <Sidebar onClick={handleSidebarClick} />
      <div className="main-content">
        <div>
           <Topbar user={user} handleSignOut={handleSignOut} />
        </div>
       
        <div className="dashboard-content">
          <div className='DBContent-container'>
            <div className="white-box redColor" onClick={() => navigate('/page1')}>
              <div className='whitebox-content'>
                <p>Vendor registration</p>
                <div>

                </div>
              </div>
            </div>
            <div className="white-box yellowColor" onClick={() => navigate('/page2')}>
             <div className='whitebox-content'>
                <p>⁠Generate invoice</p>
                <div>
                </div>
              </div>
            </div>
            <div className="white-box blueColor" onClick={() => navigate('/page3')}>
              <div className='whitebox-content'>
                <p>⁠Manage vendor</p>
                <div>
                </div>
               </div>
            </div>
            <div className="white-box vilotColor" onClick={() => navigate('/page4')}>
              <div className='whitebox-content'>
                <p>⁠Manage invoice</p>
                <div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="invoiceStatusContainer"  style={{padding:'0 2rem'}}>
        <h2>Invoice Status</h2>
        <table style={{width:'100%',borderRadius:'1rem'}} >
          <thead>
            <tr  style={{ backgroundColor: '#f1f1f1' }}>
              <th>Invoice ID</th>
              <th>Business Name</th>
              <th>Invoice Date</th>
              <th style={{textAlign:'center'}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {statusStages.map((invoice) => (
              <tr key={invoice.id} >
                <td>{invoice.id}</td>
                <td>{invoice.businessName}</td>
                <td>{invoice.date}</td>
                <td style={{textAlign:'center',alignItems:'center',display:'flex',justifyContent:'center'}}>
                  <div  style={{
                    backgroundColor: getStatusBackgroundColor(invoice.status),
                    color: '#FFFFFF',
                    padding: '10px',
                    borderRadius: '6px',
                    width:'180px',
                  }}> {invoice.status}</div>
                </td>
              </tr>
            ))}
          </tbody>
    </table>
      </div>
      </div>

      {/* Popup Component */}
      {popupVisible && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>
            <h2>{popupContent}</h2>
            <p>Details about {popupContent}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
