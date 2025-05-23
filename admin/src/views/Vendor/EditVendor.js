import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CCol, CFormInput, CFormLabel, CButton, CFormSelect } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

function EditVendor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    category: '',
    myReferral: '',
    aadharNumber: '',
    area: '',
    pincode: '',
    landmark: '',
  });

  // Get the return page from URL parameters
  const getReturnPage = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('returnPage') || '1';
  };

  const handleFetchCategory = async () => {
    try {
      const { data } = await axios.get('https://webapi.olyox.com/api/v1/categories_get');
      setCategories(data.data.reverse());
    } catch (error) {
      console.log("Error fetching categories", error);
    }
  };

  const fetchVendorData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://webapi.olyox.com/api/v1/get_Single_Provider/${id}`);
      const vendor = res.data.data;
      console.log("vendor", vendor);
      setFormData({
        name: vendor.name || '',
        email: vendor.email || '',
        number: vendor.number || '',
        // FIX: Handle category properly - check if it's an object or string
        category: vendor.category?._id || vendor.category || '',
        myReferral: vendor.myReferral || '',
        aadharNumber: vendor.aadharNumber || '',
        area: vendor.address?.area || '',
        pincode: vendor.address?.pincode || '',
        landmark: vendor.address?.landmark || '',
      });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to fetch vendor data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchCategory();
    fetchVendorData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, number, category, myReferral, aadharNumber, area, pincode, landmark } = formData;

    if (!name || !email || !number) {
      toast.error('Name, email, and number are required.');
      return;
    }

    const payload = { name, email, number, category, myReferral, aadharNumber, area, pincode, landmark };

    setLoading(true);
    try {
      const res = await axios.put(
        `https://webapi.olyox.com/api/v1/update_vendor_detail_by_admin/${id}`,
        payload
      );

      toast.success(res.data.message);

      // Navigate back to all vendors page with the correct page number - Fixed for hash routing
      const returnPage = getReturnPage();
      navigate(`/vendor/all_vendor?page=${returnPage}`);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to update vendor');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    // Navigate back to all vendors page with the correct page number - Fixed for hash routing
    const returnPage = getReturnPage();
    navigate(`/vendor/all_vendor?page=${returnPage}`);
  };

  return (
    <Form
      heading="Edit Vendor"
      btnText="Back"
      btnURL="/vendor/all_vendor"
      customBackHandler={handleBackClick}
      onSubmit={handleSubmit}
      formContent={
        <>
          <CCol md={12} className="mt-2">
            <CFormLabel htmlFor="name">Vendor Name</CFormLabel>
            <CFormInput id="name" name="name" value={formData.name} onChange={handleChange} required />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="email">Email</CFormLabel>
            <CFormInput id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="myReferral">BH ID</CFormLabel>
            <CFormInput id="myReferral" name="myReferral" type="text" value={formData.myReferral} onChange={handleChange} required />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="number">Phone Number</CFormLabel>
            <CFormInput id="number" name="number" type="number" value={formData.number} onChange={handleChange} required />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="aadharNumber">Aadhar Number</CFormLabel>
            <CFormInput id="aadharNumber" type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} required />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="area">Full Address</CFormLabel>
            <CFormInput id="area" type="text" name="area" value={formData.area} onChange={handleChange} required />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="landmark">Landmark</CFormLabel>
            <CFormInput id="landmark" type="text" name="landmark" value={formData.landmark} onChange={handleChange} required />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="pincode">Pincode</CFormLabel>
            <CFormInput id="pincode" type="number" name="pincode" value={formData.pincode} onChange={handleChange} required />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="category">Category</CFormLabel>
            <CFormSelect id="category" name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select a category</option>
              {categories
                .filter(cat => cat.isActive)
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
            </CFormSelect>
          </CCol>

          <CCol md={12} className="mt-4">
            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Vendor'}
            </CButton>
          </CCol>
        </>
      }
    />
  );
}

export default EditVendor;