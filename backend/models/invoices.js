// models/Invoice.js
const mongoose = require('mongoose');

// Define Invoice schema
const invoiceSchema = new mongoose.Schema({
  invoiceId: {
    type: String,
    required: true,
    unique: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor', // Reference to the Vendor model
    required: true,
  },
  productName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true,  // This will hold the name of the product associated with the vendor
  },
  amount: {
    type: Number,
    required: true,  // Amount of the invoice
  },
  dateIssued: {
    type: Date,
    default: Date.now,  // Defaults to current date if not provided
  },
  dueDate: {
    type: Date,
    required: true,  // Due date for the invoice
  },
  invoiceFile: {
    type: String, // Path to the uploaded invoice file
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],  // Invoice status
    default: 'Pending',
  },
  approvedBy: {
    type: String,  // Can be populated with the approver's name when the invoice is approved
  },
  approvalDate: {
    type: Date,  // Date of approval
  },
}, { timestamps: true });

// Pre-save hook to auto-generate invoiceId
invoiceSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.models.Invoice.countDocuments();
    const invoiceId = `INV-${String(count + 1).padStart(3, '0')}`;
    this.invoiceId = invoiceId;  // Auto-generate the invoiceId based on the count
  }
  next();
});

// Create Invoice model
const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
