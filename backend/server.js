// server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-adminsdk.json');
const fs = require('fs');
const path = require('path');

require('dotenv').config();
serviceAccount.private_key = process.env.FIREBASE_PRIVATE_KEY;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_ATLAS_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('MongoDB connection error:', err));

// Create uploads directory if it doesn't exist
const dir = './uploads';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}


// Routes
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendor');
const userRoutes = require('./routes/user');
const invoiceRoutes = require('./routes/invoice');
const mailerRoutes = require('./routes/mailer');

app.use('/auth', authRoutes);
app.use('/vendors', vendorRoutes);
app.use('/user', userRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/mailer',mailerRoutes);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
