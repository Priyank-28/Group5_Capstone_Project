const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  department: {
    type: String,
  },
  jobTitle: {
    type: String,
  },
  role: {
    type: String,
  },
  image: {
    type: String, // Can store image URL or file path
  },
  extensionNumber: {
    type: String,
  },
  loginTime: {
    type: Date,
    default: Date.now,
  },
});

const UniqueUser = mongoose.model('uniqueUser', userSchema);

module.exports = UniqueUser;
