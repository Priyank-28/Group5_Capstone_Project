const mongoose = require('mongoose');

// Schema for Bank Information
const bankInfoSchema = new mongoose.Schema({
  accNo: { type: String, required: true },
  branchNo: { type: String, required: true },
  transitNo: { type: String, required: true },
});

// Schema for Tax Information
const taxInfoSchema = new mongoose.Schema({
  taxId: { type: String, required: true },
  taxExemption: { type: Boolean, default: false },
});

// Vendor schema definition
const vendorSchema = new mongoose.Schema({
  autoId: { type: String, required: true,unique: true }, // Unique ID for vendors
  name: { type: String, required: true },
  product: { type: String, required: true },
  phoneNo: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  bankInfo: bankInfoSchema,  // Embedded bank info schema
  taxInfo: taxInfoSchema,    // Embedded tax info schema
  vendorAgreement: { type: String, required: false }, // PDF file path
  websiteURL: { type: String, required: false },
  status: { type: Boolean, default: false },
});


// Export the model
module.exports = mongoose.model('Vendor', vendorSchema);
