import React, { useState } from 'react';
import './assets/styles/Page1.css';
import axios from 'axios';
const Page1 = () => {
  const backendURL=process.env.REACT_APP_BACKEND_URL;
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setIsSuccessVisible(true); 
      try {
          const response = await axios.post(`${backendURL}/mailer/send-form-email`, { name, email });
          setStatus('Email sent successfully!');
      } catch (error) {
          console.error('Error sending email', error);
          setStatus('Failed to send email.');
      }
  };
 
  // const handleGenerateClick = (e) => {
  //   e.preventDefault();
  //   setIsSuccessVisible(true); 
  // };

  const handleCloseClick = () => {
    setIsSuccessVisible(false); 
  }; 

  return (
    <div className='vendorRegContainer'>
      <div className='vendorReg'>
        <h1>Vendor Registration</h1>
        <form>
          <div className='vendorInput'>
            <label>Vendor Name :</label>
            <input type="text" value={name} onChange={handleNameChange} required />
          </div>
         
          <div className='vendorInput'>
            <label>Vendor Email-Id :</label>
            <input type="email" value={email} onChange={handleEmailChange} required />
          </div>
          <div className='vendorButton'>
            <button onClick={handleSendEmail}>Generate</button>
          </div>
        </form>
      </div>

       {/* Success message, conditionally rendered */}
      {isSuccessVisible && (
      <div className='vendorSuccessMsg'>
        <div className='vendorMsgContainer'>
          <div className='vendorMsgContent'>
            <div className='vendorClose'>
              <span></span>
              <div onClick={handleCloseClick}>
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99997 10.1216L13.303 15.4246C13.5844 15.706 13.966 15.8641 14.364 15.8641C14.7619 15.8641 15.1436 15.706 15.425 15.4246C15.7064 15.1432 15.8645 14.7616 15.8645 14.3636C15.8645 13.9657 15.7064 13.584 15.425 13.3026L10.12 7.99962L15.424 2.69662C15.5632 2.55729 15.6737 2.39189 15.749 2.20987C15.8244 2.02785 15.8631 1.83277 15.8631 1.63577C15.8631 1.43877 15.8242 1.24371 15.7488 1.06172C15.6733 0.879735 15.5628 0.714389 15.4235 0.575122C15.2841 0.435855 15.1187 0.325396 14.9367 0.25005C14.7547 0.174704 14.5596 0.135948 14.3626 0.135995C14.1656 0.136041 13.9706 0.174889 13.7886 0.25032C13.6066 0.325752 13.4412 0.43629 13.302 0.575622L7.99997 5.87862L2.69697 0.575622C2.55867 0.432293 2.3932 0.317943 2.21024 0.239244C2.02727 0.160546 1.83046 0.119074 1.63129 0.11725C1.43212 0.115426 1.23459 0.153286 1.05021 0.22862C0.865828 0.303955 0.698298 0.415255 0.557394 0.556027C0.416489 0.696799 0.305031 0.864224 0.229522 1.04853C0.154014 1.23284 0.115968 1.43034 0.117604 1.62951C0.119241 1.82868 0.160526 2.02553 0.239052 2.20857C0.317578 2.39161 0.431772 2.55718 0.57497 2.69562L5.87997 7.99962L0.575971 13.3036C0.432772 13.4421 0.318578 13.6076 0.240052 13.7907C0.161526 13.9737 0.12024 14.1706 0.118604 14.3697C0.116968 14.5689 0.155014 14.7664 0.230522 14.9507C0.30603 15.135 0.417489 15.3024 0.558394 15.4432C0.699298 15.584 0.866828 15.6953 1.05121 15.7706C1.23559 15.846 1.43312 15.8838 1.63229 15.882C1.83146 15.8802 2.02827 15.8387 2.21124 15.76C2.3942 15.6813 2.55967 15.567 2.69797 15.4236L7.99997 10.1216Z" fill="#ffffff"/>
                </svg>
              </div>
            </div>
             {status && <h3>{status}</h3>}
            <div></div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Page1;