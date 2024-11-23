import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "../components/assets/styles/formpage.css"

const FormPage = () => {
  const backendURL=process.env.REACT_APP_BACKEND_URL;
  const { formToken } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    autoId: '',
    name: '',
    product: '',
    phoneNo: '',
    email: '',
    address: '',
    accNo: '',
    branchNo: '',
    transitNo: '',
    taxId: '',
    taxExemption: false,
    websiteURL: '',
    formToken: formToken
  });
  const [vendorAgreement, setVendorAgreement] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setVendorAgreement(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (vendorAgreement) data.append('vendorAgreement', vendorAgreement);
    console.log(data);
    console.log(formData);
    try {
      const response = await axios.post(`${backendURL}/vendors/register/${formToken}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitted(true);
      alert('Vendor added successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error adding vendor:', error);
      alert('Failed to add vendor. Please try again.');
    }
  };

  return (
    <div className='formPageContainer'>
    <form onSubmit={handleSubmit}>
      <h2>Register Vendor</h2>
      <div className="row">
      <div className="col">
      <div className='labelContainer'>
               <label>Auto ID</label> 
               :<input type="text" name="autoId" placeholder="Auto ID" onChange={handleInputChange} required /> 
      </div>
      <div className='labelContainer'>
               <label>Name</label> 
               : <input type="text" name="name" placeholder="Name" onChange={handleInputChange} required />
      </div>
      <div className='labelContainer'>
               <label>Product</label> 
               : <input type="text" name="product" placeholder="Product" onChange={handleInputChange} required />
      </div>
      <div className='labelContainer'>
               <label>phoneNo</label> 
               :<input type="text" name="phoneNo" placeholder="Phone No" onChange={handleInputChange} required />
      </div>
      <div className='labelContainer'>
               <label>Email</label> 
               : <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
      </div>
      <div className='labelContainer'>
               <label>Address</label> 
               :<input type="text" name="address" placeholder="Address" onChange={handleInputChange} required />
      </div>
      </div>
      <div className="col">
      <div className='labelContainer'>
               <label>Account No</label> 
               :<input type="text" name="accNo" placeholder="Account No" onChange={handleInputChange} required />
      </div>
      <div className='labelContainer'>
               <label>Branch No</label> 
               :<input type="text" name="branchNo" placeholder="Branch No" onChange={handleInputChange} required />
      </div>
      <div className='labelContainer'>
               <label>Transit No</label> 
               :<input type="text" name="transitNo" placeholder="Transit No" onChange={handleInputChange} required />
      </div>
      <div className='labelContainer'>
               <label>Tax ID</label> 
               :<input type="text" name="taxId" placeholder="Tax ID" onChange={handleInputChange} required />
      </div>
      <div className='labelContainer'>
               <label>Tax Exemption</label> 
               :<input type="checkbox" name="taxExemption" onChange={handleInputChange} /> 
      </div>
      <div className='labelContainer'>
               <label>Website URL</label> 
               :<input type="text" name="websiteURL" placeholder="Website URL" onChange={handleInputChange} />
      </div>
      <div className='labelContainer'>
               <label>vendorAgreement</label> 
               : <input type="file" name="vendorAgreement" onChange={handleFileChange} />
      </div>
      </div>
      </div>
      <button type="submit">Add Vendor</button>
    </form>
    </div>
  );
};

export default FormPage;