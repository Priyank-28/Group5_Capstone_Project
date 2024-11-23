import React, { useState } from 'react';
import { signInWithPopup, auth, provider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/styles/Login.css'; // Import your CSS for styling
import logo from './assets/images/logo.png'; // Import the logo image
import backgroundImage from './assets/images/stack.jpg'; // Import the stack image

const Login = () => {
  const backendURL=process.env.REACT_APP_BACKEND_URL;

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // For navigation

  const handleLogin = async () => {
    setLoading(true); // Set loading state
    try {
      const result = await signInWithPopup(auth, provider); // Sign in with Google
      const token = await result.user.getIdToken();

      // Send authenticated request to backend
      await axios.post(`${backendURL}/auth/login`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(result.user);
      console.log('User logged in and data stored');
      await axios.post(`${backendURL}/user/userdata`,{
        email:result.user.email
      }).then(response => {
        console.log('Response:', response.data);
        setLoading(false); // Stop loading
        if(response.data.role==='Manager'){
          console.log("Change to manager page")
          navigate('/home'); // Redirect to home page
        }else{
          navigate('/home'); // Redirect to home page
        }
      })
      .catch(error => {
          console.error('Error:', error);
      });
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false); // Stop loading in case of error
      alert('Login failed. Please try again.'); // User-friendly error message
    }
  };

  return (
    <div className="login-container">
      <div className="welcome-container">
        <img src={logo} alt="Vendy Logo" className="logo" />
        <h2>Welcome to Vendy</h2>
        <button onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In with Google'}
        </button>
        <div className="team-details">
          <p><strong>Team Members:</strong></p>
          <ul>
            <li>Mayank</li>
            <li>Priyank</li>
            <li>Linto</li>
            <li>Sowmya</li>
            <li>Senthil</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
