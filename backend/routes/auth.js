// routes/auth.js

const express = require('express');
const admin = require('firebase-admin');
const UserLog = require('../models/UserLog');

const router = express.Router();

// Middleware to verify Firebase token
const authenticateFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.userLog = decodedToken; // Attach user data to request object
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).send('Unauthorized: Invalid token');
  }
};

// Route to handle login and store user info in MongoDB
router.post('/login', authenticateFirebaseToken, async (req, res) => {
  const { name, email } = req.userLog;

  try {
    // Create a new user log in the database
    const userLog = new UserLog({ name, email });
    await userLog.save();
    res.status(200).send('User info logged successfully');
  } catch (error) {
    console.error('Error saving user info:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
