import React, { useState } from 'react';
import {
  CCol,
  CFormInput,
  CFormLabel,
  CButton,
  CFormTextarea,
} from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const AddCarList = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    time: '',
    priceRange: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, type, description, time, priceRange } = formData;

    if (!name || !type || !description || !time || !priceRange) {
      toast.error('All fields are required.');
      return;
    }

    const formPayload = new FormData();
    formPayload.append('name', name);
    formPayload.append('type', type);
    formPayload.append('description', description);
    formPayload.append('time', time);
    formPayload.append('priceRange', priceRange);

    if (imageFile) {
      formPayload.append('icons_image', imageFile); // Ensure your backend uses multer for `req.file`
    }

    setLoading(true);
    try {
      const res = await axios.post('https://www.appapi.olyox.com/api/v1/admin/createSuggestion', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(res.data.message);
      setFormData({
        name: '',
        type: '',
        description: '',
        time: '',
        priceRange: '',
      });
      setImageFile(null);
    } catch (error) {
      console.error('Error submitting ride suggestion:', error);
      toast.error(error?.response?.data?.message || 'Failed to create the ride suggestion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      heading="Add Ride Suggestion"
      btnText="Back"
      btnURL="/cars/all-cars-list"
      onSubmit={handleSubmit}
      formContent={
        <>
          <CCol md={12}>
            <CFormLabel htmlFor="name">Name</CFormLabel>
            <CFormInput
              id="name"
              name="name"
              placeholder="Enter ride name"
              value={formData.name}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="type">Type</CFormLabel>
            <CFormInput
              id="type"
              name="type"
              placeholder="Enter ride type"
              value={formData.type}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormTextarea
              id="description"
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="time">Time</CFormLabel>
            <CFormInput
              id="time"
              name="time"
              placeholder="Enter ride time"
              value={formData.time}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="priceRange">Price Range</CFormLabel>
            <CFormInput
              id="priceRange"
              name="priceRange"
              placeholder="Enter price range"
              value={formData.priceRange}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="file">Icon Image</CFormLabel>
            <CFormInput
              type="file"
              id="file"
              name="file"
              onChange={handleImageChange}
              accept="image/*"
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
  );
};

export default AddCarList;
