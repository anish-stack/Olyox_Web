import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCol, CFormInput, CFormLabel, CButton, CFormSelect } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

function EditVendor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    category: '',
  });

  const handleFetchCategory = async () => {
    try {
      const { data } = await axios.get('api/v1/categories_get');
      setCategories(data.data.reverse());
    } catch (error) {
      console.log("Error fetching categories", error);
    }
  };

  const fetchVendorData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`api/v1/get_Single_Provider/${id}`);
      const vendor = res.data.data;
      setFormData({
        name: vendor.name || '',
        email: vendor.email || '',
        number: vendor.number || '',
        category: vendor.category || '',
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
    const { name, email, number, category } = formData;

    if (!name || !email || !number) {
      toast.error('Name, email, and number are required.');
      return;
    }

    const payload = { name, email, number, category };

    setLoading(true);
    try {
      const res = await axios.put(
        `api/v1/update_vendor_detail_by_admin/${id}`,
        payload
      );

      toast.success(res.data.message);
      navigate('/vendor/all_vendor');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to update vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      heading="Edit Heavy Transport Vendor"
      btnText="Back"
      btnURL="/heavy/all-heavy-transport-vendor"
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
            <CFormLabel htmlFor="number">Phone Number</CFormLabel>
            <CFormInput id="number" name="number" value={formData.number} onChange={handleChange} required />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="category">Category</CFormLabel>
            <CFormSelect id="category" name="category" value={formData.category._id} onChange={handleChange}>
              <option value="">Select a category</option>
              {categories
                .filter(cat => cat.isActive) // Only show active ones
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
