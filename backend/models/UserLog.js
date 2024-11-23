// backend/models/UserLog.js
const mongoose = require('mongoose');

// Define User schema
const userLogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  loginTime: {
    type: Date,
    default: Date.now,
  },
});

// Create UserLog model
const UserLog = mongoose.model('UserLog', userLogSchema);

module.exports = UserLog;
