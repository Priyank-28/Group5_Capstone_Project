// routes/user.js

const express = require('express');
const UniqueUser = require('../models/uniqueuser');

const router = express.Router();

// Route to get user data by email
router.post('/userdata', async (req, res) => {
  const { email } = req.body;

  try {
    const Uuser = await UniqueUser.findOne({ email });

    if (Uuser) {
      return res.status(200).json({
        userId: Uuser._id,
        name: Uuser.name,
        department: Uuser.department,
        jobTitle: Uuser.jobTitle,
        role: Uuser.role,
        image: Uuser.image,
        email: Uuser.email,
        extensionNumber: Uuser.extensionNumber,
      });
    }

    return res.status(404).json({ message: 'User does not exist' });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
