import React, { useState, useEffect } from 'react';
import { CCol, CFormInput, CFormLabel, CButton, CFormCheck } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';
import { useParams } from 'react-router-dom';

const EditCancelReason = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: true,
  });

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleFetchData = async () => {
    try {
      const res = await axios.get(`https://www.appapi.olyox.com/api/v1/admin/cancel-reasons/${id}`);
      const data = res.data.data;
      setFormData({
        name: data.name || '',
        description: data.description || '',
        status: data.status === 'active',
      });
    } catch (error) {
      console.error('Error fetching cancel reason:', error);
      toast.error(error?.response?.data?.message || 'Failed to fetch data.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleStatusChange = (e) => {
    setFormData((prevFormData) => ({ ...prevFormData, status: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, status } = formData;

    if (!name || !description) {
      toast.error('Name and description are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `https://www.appapi.olyox.com/api/v1/admin/cancel-reasons/${id}`,
        { name, description, status: status ? 'active' : 'inactive' }
      );

      toast.success(res.data.message);
      handleFetchData();
    } catch (error) {
      console.error('Error updating cancel reason:', error);
      toast.error(error?.response?.data?.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      heading="Edit Cancel Reason"
      btnText="Back"
      btnURL="/all-cancel-reasons"
      onSubmit={handleSubmit}
      formContent={
        <>
          <CCol md={12}>
            <CFormLabel htmlFor="name">Name</CFormLabel>
            <CFormInput id="name" name="name" value={formData.name} onChange={handleChange} />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormInput id="description" name="description" value={formData.description} onChange={handleChange} />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormCheck type="checkbox" id="status" name="status" label="Active" checked={formData.status} onChange={handleStatusChange} />
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

export default EditCancelReason;
