import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Constants
const ONMODEL = ['User', 'Heavy_vehicle_partners', 'Rider', 'HotelUser', 'Restaurant'];

const PersonalCoupons = () => {
  // States
  const [coupons, setCoupons] = useState([]);
  const [partners, setPartners] = useState({
    cabAndParcel: [],
    restaurants: [],
    hotels: [],
    heavyVehicles: []
  });
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expirationDate: '',
    assignedTo: '',
    onModel: 'User'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all coupons on component mount
  useEffect(() => {
    fetchCoupons();
    fetchPartners();
  }, []);

  // Fetch all coupons
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://appapi.olyox.com/api/v1/admin/personal-coupons');
      setCoupons(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch coupons');
      setLoading(false);
      console.error('Error fetching coupons:', err);
    }
  };

  // Fetch all partners
  const fetchPartners = async () => {
    try {
      const response = await axios.get('https://appapi.olyox.com/api/v1/admin/all-partners');
      if (response.data && response.data.success) {
        setPartners(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching partners:', err);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission to create new coupon
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('https://appapi.olyox.com/api/v1/admin/personal-coupons/create', formData);
      setSuccess('Coupon created successfully!');
      setFormData({
        code: '',
        discount: '',
        expirationDate: '',
        assignedTo: '',
        onModel: 'User'
      });
      fetchCoupons();
      setLoading(false);
      setShowForm(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to create coupon');
      setLoading(false);
      console.error('Error creating coupon:', err);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  // Delete a coupon
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setLoading(true);
      try {
        await axios.delete(`https://appapi.olyox.com/api/v1/admin/personal-coupons/${id}`);
        setSuccess('Coupon deleted successfully!');
        fetchCoupons();
        setLoading(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } catch (err) {
        setError('Failed to delete coupon');
        setLoading(false);
        console.error('Error deleting coupon:', err);
        
        // Clear error message after 3 seconds
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    }
  };

  // Get partner options based on selected model
  const getPartnerOptions = () => {
    switch (formData.onModel) {
      case 'Heavy_vehicle_partners':
        return partners.heavyVehicles || [];
      case 'Restaurant':
        return partners.restaurants || [];
      case 'HotelUser':
        return partners.hotels || [];
      case 'Rider':
        return partners.cabAndParcel || [];
      default:
        return [];
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Find partner name by ID
  const getPartnerName = (id, modelType) => {
    let partnerList;
    switch (modelType) {
      case 'Heavy_vehicle_partners':
        partnerList = partners.heavyVehicles;
        break;
      case 'Restaurant':
        partnerList = partners.restaurants;
        break;
      case 'HotelUser':
        partnerList = partners.hotels;
        break;
      case 'Rider':
        partnerList = partners.cabAndParcel;
        break;
      default:
        return 'N/A';
    }
    
    if (!partnerList) return 'N/A';
    
    const partner = partnerList.find(p => p._id === id);
    return partner ? partner.name : 'N/A';
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Personal Coupons</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Hide Form' : 'Create New Coupon'}
        </button>
      </div>

      {/* Success and Error Messages */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Create Coupon Form */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">Create New Coupon</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="code" className="form-label">Coupon Code</label>
                  <input
                    type="text"
                    className="form-control"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="discount" className="form-label">Discount (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    required
                    min="1"
                    max="100"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="expirationDate" className="form-label">Expiration Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="expirationDate"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="onModel" className="form-label">User Type</label>
                  <select
                    className="form-select"
                    id="onModel"
                    name="onModel"
                    value={formData.onModel}
                    onChange={handleChange}
                    required
                  >
                    {ONMODEL.map((model) => (
                      <option key={model} value={model}>
                        {model.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {formData.onModel !== 'User' && (
                <div className="mb-3">
                  <label htmlFor="assignedTo" className="form-label">Assign To</label>
                  <select
                    className="form-select"
                    id="assignedTo"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    required={formData.onModel !== 'User'}
                  >
                    <option value="">Select Partner</option>
                    {getPartnerOptions().map((partner) => (
                      <option key={partner._id} value={partner._id}>
                        {partner.name} ({partner.BH})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupons Table */}
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">All Coupons</h4>
        </div>
        <div className="card-body">
          {loading && !showForm ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : coupons.length === 0 ? (
            <div className="alert alert-info">No coupons found</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Expiration Date</th>
                    <th>Status</th>
                    <th>User Type</th>
                    <th>Assigned To</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon._id}>
                      <td>{coupon.code}</td>
                      <td>{coupon.discount}%</td>
                      <td>{formatDate(coupon.expirationDate)}</td>
                      <td>
                        <span className={`badge ${coupon.isActive ? 'bg-success' : 'bg-danger'}`}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {' '}
                        <span className={`badge ${coupon.isUsed ? 'bg-warning' : 'bg-info'}`}>
                          {coupon.isUsed ? 'Used' : 'Not Used'}
                        </span>
                      </td>
                      <td>{coupon.onModel.replace('_', ' ')}</td>
                      <td>
                        {coupon.assignedTo && coupon.assignedTo._id 
                          ? getPartnerName(coupon.assignedTo._id, coupon.onModel)
                          : coupon.onModel === 'User' ? 'All Users' : 'N/A'}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(coupon._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalCoupons;