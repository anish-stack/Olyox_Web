import React, { useState } from 'react';
import { CCol, CFormInput, CFormLabel, CButton } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

function AddCategory() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    icon: null, // Now it's a file, not a URL string
  });

  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevFormData) => ({ ...prevFormData, icon: file }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    if (formData.icon) {
      formDataToSend.append('icon', formData.icon);
    }

    try {
      const res = await axios.post('https://www.webapi.olyox.com/api/v1/categories_create', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(res.data.message || 'Category created successfully');
      // Reset form
      setFormData({
        title: '',
        icon: null,
      });
    } catch (error) {
      console.error('Error submitting category:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to add the category. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form
        heading="Add Category"
        btnText="Back"
        btnURL="/category/all_category"
        onSubmit={handleSubmit}
        formContent={
          <>
            <CCol md={12}>
              <CFormLabel htmlFor="title">Title</CFormLabel>
              <CFormInput
                id="title"
                name="title"
                placeholder="Enter Category Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </CCol>

            <CCol md={12} className="mt-3">
              <CFormLabel htmlFor="icon">Icon (Image Upload)</CFormLabel>
              <CFormInput
                type="file"
                id="icon"
                name="icon"
                accept="image/*"
                onChange={handleFileChange}
                required
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
}

export default AddCategory;
