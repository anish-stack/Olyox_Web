import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CCol,
  CFormInput,
  CFormLabel,
  CButton,
  CFormTextarea
} from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const EditCarList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    time: '',
    priceRange: '',
    status: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleStatusChange = (e) => {
    setFormData((prevFormData) => ({ ...prevFormData, status: e.target.checked }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFetchCarList = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://demoapi.olyox.com/api/v1/admin/getSuggestionById/${id}`);
      setFormData({
        name: data.data.name,
        type: data.data.type,
        description: data.data.description,
        time: data.data.time,
        priceRange: data.data.priceRange,
        status: data.data.status,
      });
      setImageUrl(data.data?.icons_image?.url || '');      
    } catch (error) {
      console.error('Error fetching car list data:', error);
      toast.error(error?.response?.data?.message || 'Failed to fetch car list.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, type, description, time, priceRange, status } = formData;

    if (!name || !type || !description || !time || !priceRange) {
      toast.error('All fields (name, type, description, time, price range) are required.');
      return;
    }

    const payload = new FormData();
    payload.append('name', name);
    payload.append('type', type);
    payload.append('description', description);
    payload.append('time', time);
    payload.append('priceRange', priceRange);
    payload.append('status', status);

    if (selectedFile) {
      payload.append('icons_image', selectedFile);
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `https://demoapi.olyox.com/api/v1/admin/updateSuggestion/update/${id}`,
        payload,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success(res.data.message);
      navigate('/cars/all-cars-list');
    } catch (error) {
      console.error('Error updating car list:', error);
      toast.error(error?.response?.data?.message || 'Failed to update the car list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchCarList();
  }, []);

  return (
    <Form
      heading="Edit Car List"
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
              placeholder="Enter car name"
              value={formData.name}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="type">Type</CFormLabel>
            <CFormInput
              id="type"
              name="type"
              placeholder="Enter car type"
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
              placeholder="Enter time"
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
            <CFormLabel htmlFor="status">Active Status</CFormLabel>
            <CFormInput
              type="checkbox"
              id="status"
              name="status"
              checked={formData.status}
              onChange={handleStatusChange}
            />
            <div>
              <small>{formData.status ? 'This car is active' : 'This car is inactive'}</small>
            </div>
          </CCol>
          <CCol md={12} className="mt-3">
  <CFormLabel htmlFor="icons_image">Upload New Image</CFormLabel>
  <CFormInput
    type="file"
    id="icons_image"
    name="icons_image"
    onChange={handleFileChange}
    accept="image/*"
  />
  {imageUrl && (
    <div className="mt-2">
      <small>Previous Image Preview:</small>
      <br />
      <img src={imageUrl} alt="Previous" style={{ width: '200px', borderRadius: '8px' }} />
    </div>
  )}
</CCol>

          <CCol xs={12} className="mt-4">
            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? 'Please Wait...' : 'Update'}
            </CButton>
          </CCol>
        </>
      }
    />
  );
};

export default EditCarList;
