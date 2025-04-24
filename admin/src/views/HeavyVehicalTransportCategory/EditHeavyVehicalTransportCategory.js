import React, { useState, useEffect } from 'react';
import {
  CCol,
  CFormInput,
  CFormLabel,
  CButton,
  CFormCheck,
} from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';
import { useParams } from 'react-router-dom';

const EditHeavyVehicalTransportCategory = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    active: true,
  });

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const res = await axios.get(`https://demoapi.olyox.com/api/v1/heavy/heavy-category/${id}`);
      const data = res.data.data;
      setFormData({
        title: data.title || '',
        active: data.active,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error?.response?.data?.message || 'Failed to fetch category.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, active: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, active } = formData;

    if (!title.trim()) {
      toast.error('Title is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `https://demoapi.olyox.com/api/v1/heavy/heavy-category/${id}`,
        { title, active }
      );
      toast.success(res.data.message);
      fetchCategory();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(error?.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      heading="Edit Heavy Transport Category"
      btnText="Back"
      btnURL="all-heacy-transport-category"
      onSubmit={handleSubmit}
      formContent={
        <>
          <CCol md={12}>
            <CFormLabel htmlFor="title">Title</CFormLabel>
            <CFormInput
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormCheck
              type="checkbox"
              id="active"
              name="active"
              label="Active"
              checked={formData.active}
              onChange={handleCheckboxChange}
            />
          </CCol>
          <CCol xs={12} className="mt-4">
            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </CButton>
          </CCol>
        </>
      }
    />
  );
};

export default EditHeavyVehicalTransportCategory;
