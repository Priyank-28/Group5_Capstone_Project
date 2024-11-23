// src/utils/api.js
import axios from 'axios';
import { auth } from './firebase'; // import Firebase auth

// Function to fetch protected data from the backend
const fetchProtectedData = async () => {
  try {
    // Get the Firebase JWT token from the currently authenticated user
    const token = await auth.currentUser.getIdToken();

    // Make a request to the backend with the token in the Authorization header
    const response = await axios.get('http://localhost:5000/protected', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Protected Data:', response.data);  // Handle the response data
  } catch (error) {
    console.error('Error fetching protected data:', error);
  }
};

export default fetchProtectedData;
