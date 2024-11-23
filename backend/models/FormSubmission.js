const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema({
    token: String,
    submitted: { type: Boolean, default: false },
    name: String,
    email: String,
    time: {
      type: Date,
      default: Date.now,
    },
});

const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

module.exports = FormSubmission;