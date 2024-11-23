const express = require('express');
const router = express.Router();
const sendGrid = require('@sendgrid/mail');
const { v4: uuidv4 } = require('uuid');  // For unique form links
const mongoose = require('mongoose');
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
const FormSubmission = require('../models/FormSubmission');

// Generate a one-time form link and send it via email
router.post('/send-form-email', async (req, res) => {
    const { name, email } = req.body;

    // Create a unique link for the form
    const formToken = uuidv4();
    const formLink = `http://localhost:3000/form/${formToken}`;
    console.log(formLink);
    // Save token in the database with the form's state
    const formEntry = new FormSubmission({ token: formToken, submitted: false, name:name, email:email });
    await formEntry.save();

    const msg = {
        to: email,
        from: 'PriyankMistry@sendgrid.com',
        subject: `Hi ${name}, please fill out your one-time form`,
        html: `<p>Hello ${name},</p><p>Please complete your form: <a href="${formLink}">Click here</a></p>`
    };

    try {
        console.log(formLink);
        console.log(msg);
        //await sendGrid.send(msg);
        sendGrid
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            });
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email', error);
        res.status(500).send('Failed to send email');
    }
});

// Endpoint to submit the form
router.post('/submit-form/:formToken', async (req, res) => {
    const { formToken } = req.params;
    const formData = req.body;

    // Validate token and check if it's already used
    const formEntry = await FormSubmission.findOne({ token: formToken, submitted: false });

    if (!formEntry) {
        return res.status(400).send('Invalid or already used form link');
    }

    // Update form entry
    formEntry.submitted = true;
    formEntry.name = formData.name;
    formEntry.email = formData.email;
    await formEntry.save();

    res.status(200).send('Form submitted successfully');
});

router.get('/get-form-submissions', async (req, res) => {
    try {
        const submissions = await FormSubmission.find();
        res.status(200).json({
            message: 'Form submissions fetched successfully',
            data: submissions,
        });
    } catch (error) {
        console.error('Error fetching form submissions:', error);
        res.status(500).json({ message: 'Failed to fetch form submissions' });
    }
});

// Update a form entry
router.put('/update-form/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        // Use findByIdAndUpdate to update the form submission
        const updatedForm = await FormSubmission.findByIdAndUpdate(
            id,
            { ...updateData },
            { new: true } // Return the updated document
        );

        if (!updatedForm) {
            return res.status(404).json({ message: 'Form entry not found' });
        }

        res.status(200).json({
            message: 'Form updated successfully',
            data: updatedForm,
        });
    } catch (error) {
        console.error('Error updating form:', error);
        res.status(500).json({ message: 'Failed to update form' });
    }
});

// Delete a form entry
router.delete('/delete-form/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const deletedForm = await FormSubmission.findByIdAndDelete(id);
        if (!deletedForm) {
            return res.status(404).json({ message: 'Form entry not found' });
        }
        res.status(200).json({
            message: 'Form deleted successfully',
            data: deletedForm,
        });
    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({ message: 'Failed to delete form' });
    }
});

module.exports = router;