import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase'; // Ensure firebase auth is set up
import Login from './components/Login'; // Correct path to Login component
import Home from './components/Home'; // Correct path to Home component
import Page1 from './components/Page1'; // Correct path to Page1 component
import Page2 from './components/Page2'; // Import the renamed Page2 component
import Page3 from './components/Page3.js';
import Page4 from './components/Page4';
import FormPage from './components/FormPage.js';
import SendFormEmailPage from './components/SendFormEmailPage';
import './App.css'; // Correct path to App.css

const App = () => {
  const backendURL=process.env.REACT_APP_BACKEND_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state for better UX
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false); // Stop loading once the auth state is checked
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>; // Show loading state with a spinner
  }

  if (error) {
    return <div className="error-message">{error}</div>; // Display error message if exists
  }

  return (
    <Routes>
      {/* Redirect to Login if not authenticated */}
      <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
      <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/" />} />
      <Route path="/page1" element={user ? <Page1 /> : <Navigate to="/" />} />
      <Route path="/page2" element={user ? <Page2 /> : <Navigate to="/" />} /> {/* Updated path to Page2 */}
      <Route path="/page4" element={user ? <Page4 /> : <Navigate to="/" />} /> {/* Updated path to Page2 */}
      <Route path="/send-form-email" element={<SendFormEmailPage />} />
      <Route path="/form/:formToken" element={<FormPage />} />
      <Route path="/page3" element={user ? <Page3 /> : <Navigate to="/" />} />
    </Routes>
  );
};

export default App;
