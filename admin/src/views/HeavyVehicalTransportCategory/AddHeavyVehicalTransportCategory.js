import React, { useState } from 'react';
import { CCol, CFormInput, CFormLabel, CButton, CFormCheck } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const AddHeavyVehicalTransportCategory = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    active: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({ ...prev, active: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, active } = formData;

    if (!title.trim()) {
      toast.error('Category title is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('https://demoapi.olyox.com/api/v1/heavy/heavy-category', {
        title,
        active,
      });
      toast.success(res.data.message);
      setFormData({
        title: '',
        active: true,
      });
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to create heavy transport category. Try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form
        heading="Add Heavy Transport Category"
        btnText="Back"
        btnURL="/all-heacy-transport-category"
        onSubmit={handleSubmit}
        formContent={
          <>
            <CCol md={12}>
              <CFormLabel htmlFor="title">Title</CFormLabel>
              <CFormInput
                id="title"
                name="title"
                placeholder="Enter category title"
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
                onChange={handleStatusChange}
              />
            </CCol>
            <CCol xs={12} className="mt-4">
              <CButton color="primary" type="submit" disabled={loading}>
                {loading ? 'Please Wait...' : 'Submit'}
              </CButton>
            </CCol>
          </>
        }
      />
    </>
  );
};

export default AddHeavyVehicalTransportCategory;
