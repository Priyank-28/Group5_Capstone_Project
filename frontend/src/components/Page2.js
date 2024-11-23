import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './assets/styles/Page2.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation


const Page2 = () => {
  const backendURL=process.env.REACT_APP_BACKEND_URL;
  const [invoices, setInvoices] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [editedInvoice, setEditedInvoice] = useState(null);

  const [newInvoice, setNewInvoice] = useState({
    invoiceId: '',
    vendorId: '',
    productName: '',
    dateIssued: '',
    dueDate: '',
    amount: '',
    invoiceFile: null
  });
  const [lastInvoiceId, setLastInvoiceId] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null); // For displaying selected invoice details

  useEffect(() => {
    fetchInvoices();
    fetchVendors();
    fetchProductsByVendor();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${backendURL}/invoices/list`);
      setInvoices(response.data);
      updateLastInvoiceId(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };
  // Function to toggle editing mode
const toggleEdit = () => {
  setIsEditing(true);
};
  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#FFA500'; // Orange for Pending
      case 'More Info Required':
        return '#0074A3'; // Blue for More Info Required
      case 'Approved':
        return '#52B80E'; // Green for Approved
      case 'Rejected':
        return '#F46B5B'; // Red for Rejected
      default:
        return '#888888'; // Default color
    }
  };
  const handleSave = async () => {
    try {
      const response = await axios.put(`${backendURL}/invoices/update/${editedInvoice._id}`, editedInvoice);
      if (response.status === 200) {
        setInvoices((prevInvoices) =>
          prevInvoices.map((inv) => (inv._id === editedInvoice._id ? editedInvoice : inv))
        );
        setIsEditing(false); // Exit editing mode
        setIsModalOpen(false); // Close the modal after saving
      } else {
        alert('Error updating the invoice');
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert('An error occurred while updating the invoice');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await axios.delete(`${backendURL}/invoices/delete/${selectedInvoice._id}`);
        const updatedInvoices = invoices.filter(invoice => invoice._id !== selectedInvoice._id);
        setInvoices(updatedInvoices);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  };


  const updateLastInvoiceId = (invoices) => {
    if (invoices.length > 0) {
      const maxId = Math.max(
        ...invoices.map((invoice) => {
          const idNumber = parseInt(invoice.invoiceId.replace('INV', ''), 10);
          return isNaN(idNumber) ? 0 : idNumber;
        })
      );
      setLastInvoiceId(maxId);
    }
  };
  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${backendURL}/vendors/vendors`);
      console.log(response.data);
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };


  // const fetchProducts = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:5001/products');
  //     setProducts(response.data);
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //   }
  // };
  const fetchProductsByVendor = async (vendorId) => {
    try {
      const response = await axios.get(`http://localhost:5001/products?vendorId=${vendorId}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  

  const generateInvoiceId = () => {
    const newId = lastInvoiceId + 1;
    return `INV${String(newId).padStart(2, '0')}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInvoice((prev) => ({ ...prev, [name]: value }));
  };



  const handleAddInputChange = (e) => {
    console.log("Input Change");
    const { name, value } = e.target;
    setNewInvoice((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    setNewInvoice((prev) => ({ ...prev, invoiceFile: e.target.files[0] }));
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
    setEditedInvoice(null);
    setIsEditing(false); // Reset editing mode
  };

  const handleSaveInvoice = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      for (const key in newInvoice) {
        formData.append(key, newInvoice[key]);
      }

      console.log("Form Data before submission:", [...formData.entries()]);
  
      // Send the POST request with formData
      const response = await axios.post(`${backendURL}/invoices/create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },

      });
  
      // Handle successful response
      console.log('Server response:', response.data);
      setLastInvoiceId((prev) => prev + 1);
      setMessage('Invoice saved successfully');
      fetchInvoices(); // Refresh invoices list
      setShowModal(false);
    } catch (error) {
      console.error('Error saving invoice:', error);
      setMessage('Failed to save invoice');
    } finally {
      setIsSaving(false);
    }
  };
      
  

  

  const handleSendForApproval = async () => {
    setIsSending(true);
    try {
      await axios.post(`${backendURL}/invoices/sendForApproval`, newInvoice);
      setMessage('Email sent for approval');
      setShowModal(false);
    } catch (error) {
      console.error('Error sending for approval:', error);
      setMessage('Failed to send for approval');
    } finally {
      setIsSending(false);
    }
  };

  const openModal = () => {
    const nextInvoiceId = generateInvoiceId();
    setNewInvoice((prev) => ({ ...prev, invoiceId: nextInvoiceId }));
    setShowModal(true);
  };

  const fetchInvoiceDetails = async (invoiceId) => {
    try {
      const response = await axios.get(`${backendURL}/invoices/${invoiceId}`);
      const invoiceData = response.data;
  
      // Ensure status is available and set it in the editedInvoice
      if (invoiceData.status) {
        setEditedInvoice(invoiceData);
        setSelectedInvoice(invoiceData);
      } else {
        console.error('Status field is missing in the fetched data.');
      }
    } catch (error) {
      console.error('Error fetching invoice details:', error);
    }
  };
  
  
  return (
    <div className="invoice-management">
      <h1>Invoice Management</h1>

      <div className="button-container">
        <button className="primary-button" onClick={openModal}>
          Add Invoice
        </button>
      </div>

      {/* Invoice List Section */}
      <div className="invoice-list">
        <h2>Invoice List</h2>
        <table>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Vendor Name</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice._id}
                onClick={() => fetchInvoiceDetails(invoice._id)}
                style={{ cursor: 'pointer' }}
              >
                <td>{invoice.invoiceId}</td>
                <td>{invoice.vendorId?.name || 'Unknown Vendor'}</td>
                <td>${invoice.amount}</td>
                <td>{invoice.status || 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="modal">
        <div className="modal-content">
          
          <div
        className="modal-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2>Invoice Details</h2>
        <button onClick={closeModal} className="close-button">
          ×
        </button>
      </div>

            
            <form className="invoice-form" style={{ display: 'grid', gap: '15px' }}>


<div className="form-group">
<label>Invoice ID:</label>
<input
  type="text"
  name="invoiceId"
  value={editedInvoice?.invoiceId || ''}
  onChange={handleInputChange}
  disabled={!isEditing}
 className="w-full p-2 border rounded"
                />
              </div>
  
  


<div className="form-group">
  <label>Amount:</label>
  <input
    type="number"
    name="amount"
    value={editedInvoice?.amount || ''}
    onChange={handleInputChange}
    disabled={!isEditing}
    className="w-full p-2 border rounded"
  />
</div>

<div className="form-group">
                <label>Vendor Name:</label>
                <input
                  type="text"
                  name="businessName"
                  value={editedInvoice?.vendorId?.name || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full p-2 border rounded"
                />
              </div>


{/* Date Issued */}
<div className="form-group">
    <label>Date Issued:</label>
    <input
      type="date"
      name="dateIssued"
      value={editedInvoice?.dateIssued ? editedInvoice.dateIssued.split('T')[0] : ''}
      onChange={handleInputChange}
      disabled={!isEditing}
      className="w-full p-2 border rounded"
    />
  </div>

  <div className="form-group">

  <label>Due Date:</label>
  <input
    type="date"
    name="dueDate"
    value={editedInvoice?.dueDate ? editedInvoice.dueDate.split('T')[0] : ''}
    onChange={handleInputChange}
    disabled={!isEditing}
    className="w-full p-2 border rounded"
  />
</div>  

<div className="form-group">
  <label>Status:</label>
  <select
    name="status"
    value={editedInvoice?.status || ''} // Bind to the database value
    disabled
    className="w-full p-2 border rounded"
  >
    {editedInvoice?.status ? null : <option value="" disabled>Select Status</option>}
    <option value="Pending">Pending</option>
    <option value="Need more Info">Need more Info</option> {/* Match database value */}
    <option value="Approved">Approved</option>
    <option value="Rejected">Rejected</option>
  </select>
</div>

 {/* Approved By */}
 <div className="form-group">
    <label>Approved By:</label>
    <input
      type="text"
      name="approvedBy"
      value={editedInvoice?.approvedBy || ''}
      onChange={handleInputChange}
      disabled={!isEditing}
      className="w-full p-2 border rounded"
    />
  </div>
{/* Approval Date */}
<div className="form-group">
    <label>Approval Date:</label>
    <input
      type="date"
      name="approvalDate"
      value={editedInvoice?.approvalDate ? editedInvoice.approvalDate.split('T')[0] : ''}
      onChange={handleInputChange}
      disabled={!isEditing}
      className="w-full p-2 border rounded"
    />
  </div>
{/* Buttons */}
<div className="form-buttons" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
  {/* Show Edit and Delete buttons when not editing */}
  {!isEditing ? (
    <>
      <button
        type="button"
        onClick={toggleEdit} // Handle editing toggle
        className="edit-button"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={handleDelete} // Handle delete functionality
        className="delete-button"
      >
        Delete
      </button>
    </>
  ) : (
    // Show Save and Cancel buttons when in editing mode
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      
      <button
        type="button"
        onClick={handleSave} // Save the changes made during editing
        className="save-button"
      >
        Save 
      </button>
      <button
        type="button"
        onClick={() => setIsEditing(false)} // Cancel editing
        className="cancel-button"
      >
        Cancel
      </button>
    </div>
  )}
</div>


  
            </form>

          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Add New Invoice</h2>
            <form>
              <div className="form-group">
                <label htmlFor="invoiceId">Invoice ID:</label>
                <input type="text" id="invoiceId" name="invoiceId" value={newInvoice.invoiceId} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="vendorId">Vendor Name:</label>
                <select
                  id="vendorId"
                  name="vendorId"
                  onChange={handleAddInputChange}
                  value={newInvoice.vendorId}
                  required
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor._id} value={vendor.name}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="productName">Product Name:</label>
                <select
                  id="productName"
                  name="productName"
                  onChange={handleAddInputChange}
                  value={newInvoice.productName}
                  required
                >
                  <option value="">Select Product</option>
                  {vendors.map((vendor) => (
                    <option key={vendor._id} value={vendor.product}>
                      {vendor.product}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="dateIssued">Date Issued:</label>
                <input
                  type="date"
                  id="dateIssued"
                  name="dateIssued"
                  value={newInvoice.dateIssued}
                  onChange={handleAddInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dueDate">Due Date:</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={newInvoice.dueDate}
                  onChange={handleAddInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount:</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={newInvoice.amount}
                  onChange={handleAddInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="invoiceFile">Upload Invoice:</label>
                <input type="file" id="invoiceFile" name="invoiceFile" onChange={handleFileChange} />
              </div>
              <div className="button-group">
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleSaveInvoice}
                  disabled={isSaving || isSending}
                >
                  {isSaving ? 'Saving...' : 'Save Invoice'}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleSendForApproval}
                  disabled={isSaving || isSending}
                >
                  {isSending ? 'Sending...' : 'Send for Approval'}
                </button>
              </div>
            </form>
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page2;
