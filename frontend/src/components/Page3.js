import React, { useEffect, useState } from "react";
import axios from "axios";
import './assets/styles/Page3.css';
import { useNavigate } from 'react-router-dom'; 
const Page3 = () => {
  const backendURL=process.env.REACT_APP_BACKEND_URL;
  const [vendors, setVendors] = useState([]);
  const [editingId, setEditingId] = useState(null); // ID of the vendor being edited
  const [editFormData, setEditFormData] = useState({}); // Form data for editing

  // Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/vendors/vendors`
        );
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  // Handle input change during editing
  const handleInputChange = (e, vendorId) => {
    const { name, value } = e.target;
    setEditFormData((prevState) => ({
      ...prevState,
      [vendorId]: {
        ...prevState[vendorId],
        [name]: value,
      },
    }));
  };

  // Save edited vendor
  const saveEditedVendor = async (vendorId) => {
    try {
      const updatedData = editFormData[vendorId];
      const response = await axios.put(
        `${backendURL}/vendors/update/${vendorId}`,
        updatedData
      );

      setVendors(
        vendors.map((vendor) =>
          vendor._id === vendorId ? { ...vendor, ...response.data } : vendor
        )
      );
      setEditingId(null); // Exit edit mode
      alert("Vendor updated successfully!");
    } catch (error) {
      console.error("Error updating vendor:", error);
      alert("Failed to update vendor.");
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditFormData({});
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        await axios.delete(`${backendURL}/vendors/delete/${id}`);
        setVendors(vendors.filter((vendor) => vendor._id !== id));
        alert("Vendor deleted successfully!");
      } catch (error) {
        console.error("Error deleting vendor:", error);
        alert("Failed to delete vendor.");
      }
    }
  };
  const navigate = useNavigate();

  return (
    <div className='vendorListPage'>
      <h2>Vendor List</h2>
      {vendors.length > 0 ? (
        <table >
          <thead>
            <tr style={{ backgroundColor: '#f1f1f1' }}>
              <th>Auto ID</th>
              <th>Name</th>
              <th>Product</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Website URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id}>
                <td>{vendor.autoId}</td>

                {/* Editable fields */}
                {editingId === vendor._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={editFormData[vendor._id]?.name || vendor.name}
                        onChange={(e) => handleInputChange(e, vendor._id)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="product"
                        value={
                          editFormData[vendor._id]?.product || vendor.product
                        }
                        onChange={(e) => handleInputChange(e, vendor._id)}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        name="email"
                        value={
                          editFormData[vendor._id]?.email || vendor.email
                        }
                        onChange={(e) => handleInputChange(e, vendor._id)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="phoneNo"
                        value={
                          editFormData[vendor._id]?.phoneNo || vendor.phoneNo
                        }
                        onChange={(e) => handleInputChange(e, vendor._id)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="websiteURL"
                        value={
                          editFormData[vendor._id]?.websiteURL || vendor.websiteURL
                        }
                        onChange={(e) => handleInputChange(e, vendor._id)}
                      />
                    </td>
                  </>
                ) : (
                  <>
                    {/* Non-editable fields */}
                    <td>{vendor.name}</td>
                    <td>{vendor.product}</td>
                    <td>{vendor.email}</td>
                    <td>{vendor.phoneNo}</td>
                    <td>{vendor.websiteURL}</td>
                  </>
                )}

                <td>
                  {editingId === vendor._id ? (
                    <>
                      <div className='tablebtn'>
                      <button onClick={() => saveEditedVendor(vendor._id)} style={{background:"none",color:"#52B80E"}}>
                        Save
                      </button>
                      <button onClick={cancelEditing} style={{background:"none",color:"#52B80E"}}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                    <div className='tablebtn'>
                        <button  onClick={() => setEditingId(vendor._id)} className="action-btn edit-btn" style={{background:"none"}}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 15.9997L4 19.9997L8 18.9997L19.586 7.4137C19.9609 7.03864 20.1716 6.53003 20.1716 5.9997C20.1716 5.46937 19.9609 4.96075 19.586 4.5857L19.414 4.4137C19.0389 4.03876 18.5303 3.82812 18 3.82812C17.4697 3.82813 16.9611 4.03876 16.586 4.4137L5 15.9997Z" stroke="#52B80E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5 16L4 20L8 19L18 9L15 6L5 16Z" fill="#52B80E"/>
                                <path d="M15 6L18 9M13 20H21" stroke="#52B80E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button onClick={() => handleDelete(vendor._id)} className="action-btn delete-btn">
                            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 18C2.45 18 1.97933 17.8043 1.588 17.413C1.19667 17.0217 1.00067 16.5507 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8043 17.021 14.413 17.413C14.0217 17.805 13.5507 18.0007 13 18H3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z" fill="#F46B5B"/>
                            </svg>
                        </button>
                  </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No vendors found</p>
      )}

      <button onClick={() => navigate('/page1')}>Add</button>
    </div>
  );
};

export default Page3;