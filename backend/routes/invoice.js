const express = require('express');
const Invoice = require('../models/invoices');
const Vendor = require('../models/vendor');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = 'uploads/invoices';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'INV-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure multer with file validation
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific file types
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only PDF, JPEG and PNG files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Create a new invoice
router.post('/create', upload.single('invoiceFile'), async (req, res) => {
  try {
    const { vendorId, productName, amount, dueDate, dateIssued, invoiceId } = req.body;

    // Check if the vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      // If file was uploaded, delete it since vendor validation failed
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Create a new invoice with file path if file was uploaded
    const newInvoice = new Invoice({
      invoiceId,
      vendorId,
      productName,
      amount,
      dateIssued,
      dueDate,
      status: 'Pending',
      invoiceFilePath: req.file ? req.file.path : null
    });

    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Get all invoices
router.get('/list', async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .select('invoiceId vendorId amount status invoiceFilePath')
      .populate('vendorId', 'name')
      .exec();
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Get a single invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('vendorId', 'name')
      .populate('productName', 'name')
      .exec();
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// Update an invoice
router.put('/update/:id', upload.single('invoiceFile'), async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // If new file is uploaded, delete old file
    if (req.file && invoice.invoiceFilePath) {
      try {
        fs.unlinkSync(invoice.invoiceFilePath);
      } catch (err) {
        console.error('Error deleting old file:', err);
      }
    }

    const updateData = {
      ...req.body,
      invoiceFilePath: req.file ? req.file.path : invoice.invoiceFilePath
    };

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json(updatedInvoice);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// Delete an invoice
router.delete('/:id', async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!deletedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Delete associated file if it exists
    if (invoice.invoiceFilePath) {
      try {
        fs.unlinkSync(invoice.invoiceFilePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

// Route to approve an invoice
router.put('/approve/:id', async (req, res) => {
  const { approvedBy } = req.body;

  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Approved', 
        approvedBy, 
        approvalDate: Date.now() 
      },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(updatedInvoice);
  } catch (error) {
    console.error('Error approving invoice:', error);
    res.status(500).json({ error: 'Failed to approve invoice' });
  }
});

module.exports = router;
