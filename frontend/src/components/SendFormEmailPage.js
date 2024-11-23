import React, { useState } from 'react';
import axios from 'axios';

function SendFormEmailPage() {
    const backendURL=process.env.REACT_APP_BACKEND_URL;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const handleNameChange = (e) => setName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);

    const handleSendEmail = async () => {
        try {
            const response = await axios.post(`${backendURL}/mailer/send-form-email`, { name, email });
            setStatus('Email sent successfully!');
        } catch (error) {
            console.error('Error sending email', error);
            setStatus('Failed to send email.');
        }
    };

    return (
        <div>
            <h2>Send Form Link</h2>
            <label>
                Name:
                <input type="text" value={name} onChange={handleNameChange} required />
            </label>
            <label>
                Email:
                <input type="email" value={email} onChange={handleEmailChange} required />
            </label>
            <button onClick={handleSendEmail}>Send Form Link</button>
            {status && <p>{status}</p>}
        </div>
    );
}

export default SendFormEmailPage;
