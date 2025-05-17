import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCol, CFormInput, CFormLabel, CButton, CFormSwitch } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    isActive: true,
    icon: null, // Now handling file instead of URL
    currentIcon: '', // To display current icon URL
  });

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevFormData) => ({ ...prevFormData, icon: file }));
  };

  // Handle isActive toggle
  const handleToggle = (e) => {
    const { checked } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, isActive: checked }));
  };

  // Fetch existing category
  const handleFetchCategory = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(`https://webapi.olyox.com/api/v1/categories/${id}`);
      setFormData({
        title: data.data.title,
        isActive: data.data.isActive ?? true, // default to true if missing
        icon: null,
        currentIcon: data.data.icon,
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to fetch category. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Submit the updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('isActive', formData.isActive);
    if (formData.icon) {
      formDataToSend.append('icon', formData.icon);
    }

    try {
      const res = await axios.put(`https://webapi.olyox.com/api/v1/categories/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(res.data.message || 'Category updated successfully');
      navigate('/category/all_category');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to update the category. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchCategory();
  }, []);

  return (
    <>
      <Form
        heading="Edit Category"
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
                placeholder="Enter Category title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </CCol>

            <CCol md={12} className="mt-3">
              <CFormLabel htmlFor="icon">Icon (Upload New Image if you want to change)</CFormLabel>
              <CFormInput
                type="file"
                id="icon"
                name="icon"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.currentIcon && (
                <div className="mt-2">
                  <small>Current Icon:</small>
                  <br />
                  <img
                    src={formData.currentIcon}
                    alt="Current Icon"
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              )}
            </CCol>

            <CCol md={12} className="mt-3">
              <CFormLabel htmlFor="isActive">Is Active</CFormLabel>
              <CFormSwitch
                id="isActive"
                name="isActive"
                label={formData.isActive ? 'Active' : 'Inactive'}
                checked={formData.isActive}
                onChange={handleToggle}
              />
            </CCol>

            <CCol xs={12} className="mt-4">
              <CButton color="primary" type="submit" disabled={loading}>
                {loading ? 'Please Wait...' : 'Update'}
              </CButton>
            </CCol>
          </>
        }
      />
    </>
  );
}

export default EditCategory;
