// routes/vendors.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const Vendor = require('../models/vendor');
const FormSubmission = require('../models/FormSubmission');

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route to register a new vendor with file upload
router.post('/register/:formToken', upload.single('vendorAgreement'), async (req, res) => {
  try {
    console.log(req.body);
    const formEntry = await FormSubmission.findOne({ token: req.body.formToken, submitted: false });

    if (!formEntry) {
        return res.status(400).send('Invalid or already used form link');
    }
    formEntry.submitted = true;
    await formEntry.save();
    const newVendor = new Vendor({
      autoId: req.body.autoId,
      name: req.body.name,
      product: req.body.product,
      phoneNo: req.body.phoneNo,
      email: req.body.email,
      address: req.body.address,
      bankInfo: {
        accNo: req.body.accNo,
        branchNo: req.body.branchNo,
        transitNo: req.body.transitNo,
      },
      taxInfo: {
        taxId: req.body.taxId,
        taxExemption: req.body.taxExemption === 'true',
      },
      vendorAgreement: req.body.vendoragreement ? req.body.vendoragreement : null, // File path for vendor agreement
      websiteURL: req.body.websiteURL,
    });
    //save vendor to MongoDB
    const savedVendor = await newVendor.save();
    res.status(201).json(savedVendor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add vendor' });
  }
});

// Route to get all vendors
router.get('/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});
// Save (Add) a new vendor
router.post('/add', async (req, res) => {
  try {
      const newVendor = new Vendor(req.body);
      await newVendor.save();
      res.status(201).json(newVendor);
  } catch (error) {
      res.status(400).json({ message: 'Error saving vendor', error });
  }
});

// Update an existing vendor
router.put('/update/:id', async (req, res) => {
  try {
      const updatedVendor = await Vendor.findByIdAndUpdate(
          req.params.id,
          { ...req.body, updatedAt: Date.now() },
          { new: true, runValidators: true }
      );
      if (!updatedVendor) return res.status(404).json({ message: 'Vendor not found' });
      res.json(updatedVendor);
  } catch (error) {
      res.status(400).json({ message: 'Error updating vendor', error });
  }
});

// Soft Delete a vendor (set status to false)
router.delete('/delete/:id', async (req, res) => {
  try {
      const vendor = await Vendor.findByIdAndUpdate(
          req.params.id,
          { status: false, updatedAt: Date.now() },
          { new: true }
      );
      if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
      res.json({ message: 'Vendor deleted (soft)', vendor });
  } catch (error) {
      res.status(400).json({ message: 'Error deleting vendor', error });
  }
});

module.exports = router;
