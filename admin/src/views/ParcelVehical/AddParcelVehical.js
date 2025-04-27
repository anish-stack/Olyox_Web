import React, { useState } from 'react';
import { CCol, CFormInput, CFormLabel, CButton, CFormSelect, CFormSwitch } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const AddParcelVehical = () => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    BaseFare: '',
    title: '',
    info: '',
    max_weight: '',
    price_per_km: '',
    status: true,
    anyTag: false,
    tag: '',
    time_can_reach: '',
    position: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      if (imageFile) {
        payload.append('image', imageFile);
      }

      for (const key in formData) {
        payload.append(key, formData[key]);
      }

      const res = await axios.post(
        'https://www.appapi.olyox.com/api/v1/parcel/create-parcel',
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      toast.success(res?.data?.message || 'Parcel Vehicle created successfully!');
      
      // Reset form after submit
      setFormData({
        BaseFare: '',
        title: '',
        info: '',
        max_weight: '',
        price_per_km: '',
        status: true,
        anyTag: false,
        tag: '',
        time_can_reach: '',
        position: '',
      });
      setImageFile(null);
    } catch (error) {
      console.error('Error creating parcel vehicle:', error);
      toast.error(error?.response?.data?.message || 'Failed to create Parcel Vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      heading="Add Parcel Vehicle"
      btnText="Back"
      btnURL="/all-parcel-vehical"
      onSubmit={handleSubmit}
      formContent={
        <>
          <CCol md={12}>
            <CFormLabel htmlFor="image">Upload Vehicle Image</CFormLabel>
            <CFormInput
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="title">Title</CFormLabel>
            <CFormInput
              id="title"
              name="title"
              placeholder="Enter vehicle title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="info">Info</CFormLabel>
            <CFormInput
              id="info"
              name="info"
              placeholder="Enter vehicle info"
              value={formData.info}
              onChange={handleChange}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="max_weight">Max Weight (kg)</CFormLabel>
            <CFormInput
              id="max_weight"
              name="max_weight"
              type="number"
              placeholder="Enter max weight"
              value={formData.max_weight}
              onChange={handleChange}
              min={0}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="price_per_km">Price per Km (₹)</CFormLabel>
            <CFormInput
              id="price_per_km"
              name="price_per_km"
              type="number"
              placeholder="Enter price per km"
              value={formData.price_per_km}
              onChange={handleChange}
              min={0}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="BaseFare">Base Fare (₹)</CFormLabel>
            <CFormInput
              id="BaseFare"
              name="BaseFare"
              type="number"
              placeholder="Enter base fare"
              value={formData.BaseFare}
              onChange={handleChange}
              min={0}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="time_can_reach">Time to Reach (min)</CFormLabel>
            <CFormInput
              id="time_can_reach"
              name="time_can_reach"
              type="number"
              placeholder="Enter estimated time to reach"
              value={formData.time_can_reach}
              onChange={handleChange}
              min={0}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="position">Position</CFormLabel>
            <CFormInput
              id="position"
              name="position"
              type="number"
              placeholder="Enter position"
              value={formData.position}
              onChange={handleChange}
              min={0}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="tag">Tag (optional)</CFormLabel>
            <CFormInput
              id="tag"
              name="tag"
              placeholder="Enter tag if any"
              value={formData.tag}
              onChange={handleChange}
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel>Status</CFormLabel>
            <CFormSwitch
              id="status"
              name="status"
              color="success"
              size="lg"
              checked={formData.status}
              onChange={handleChange}
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel>Any Tag Active?</CFormLabel>
            <CFormSwitch
              id="anyTag"
              name="anyTag"
              color="primary"
              size="lg"
              checked={formData.anyTag}
              onChange={handleChange}
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

export default AddParcelVehical;
