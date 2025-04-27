import React, { useState, useEffect } from 'react';
import { CCol, CFormInput, CFormLabel, CFormSelect, CButton } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';
import { useParams } from 'react-router-dom';

const EditParcelVehical = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    info: '',
    BaseFare: '',
    max_weight: '',
    price_per_km: '',
    status: false,
    anyTag: false,
    tag: '',
    time_can_reach: '',
    position: '',
    image: null, // for new file
    previewImage: '', // for showing old image
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await axios.get(`https://www.appapi.olyox.com/api/v1/parcel/single-parcel/${id}`);
        const data = res.data.data;
        setFormData((prev) => ({
          ...prev,
          title: data.title || '',
          info: data.info || '',
          BaseFare: data.BaseFare || '',
          max_weight: data.max_weight || '',
          price_per_km: data.price_per_km || '',
          status: data.status || false,
          anyTag: data.anyTag || false,
          tag: data.tag || '',
          time_can_reach: data.time_can_reach || '',
          position: data.position || '',
          previewImage: data.image?.url || '',
        }));
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        toast.error('Failed to fetch vehicle details.');
      }
    };
    fetchVehicle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === 'true',
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        previewImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('info', formData.info);
      payload.append('BaseFare', formData.BaseFare);
      payload.append('max_weight', formData.max_weight);
      payload.append('price_per_km', formData.price_per_km);
      payload.append('status', formData.status);
      payload.append('anyTag', formData.anyTag);
      payload.append('tag', formData.tag);
      payload.append('time_can_reach', formData.time_can_reach);
      payload.append('position', formData.position);

      if (formData.image) {
        payload.append('image', formData.image);
      }

      const res = await axios.put(
        `https://www.appapi.olyox.com/api/v1/parcel/update-parcel/${id}`,
        payload,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      toast.success(res.data.message || 'Vehicle updated successfully!');
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error(error?.response?.data?.message || 'Failed to update vehicle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      heading="Edit Parcel Vehicle"
      btnText="Back"
      btnURL="/all-parcel-vehical"
      onSubmit={handleSubmit}
      formContent={
        <>
          <CCol md={12}>
            <CFormLabel htmlFor="title">Title</CFormLabel>
            <CFormInput
              id="title"
              name="title"
              placeholder="Enter Title"
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
              placeholder="Enter Info"
              value={formData.info}
              onChange={handleChange}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="BaseFare">Base Fare</CFormLabel>
            <CFormInput
              id="BaseFare"
              name="BaseFare"
              type="number"
              placeholder="Enter Base Fare"
              value={formData.BaseFare}
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
              placeholder="Enter Max Weight"
              value={formData.max_weight}
              onChange={handleChange}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="price_per_km">Price Per KM</CFormLabel>
            <CFormInput
              id="price_per_km"
              name="price_per_km"
              type="number"
              placeholder="Enter Price Per KM"
              value={formData.price_per_km}
              onChange={handleChange}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="time_can_reach">Time Can Reach (in minutes)</CFormLabel>
            <CFormInput
              id="time_can_reach"
              name="time_can_reach"
              type="number"
              placeholder="Enter Time"
              value={formData.time_can_reach}
              onChange={handleChange}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="position">Position</CFormLabel>
            <CFormInput
              id="position"
              name="position"
              type="number"
              placeholder="Enter Position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="status">Status</CFormLabel>
            <CFormSelect
              id="status"
              name="status"
              value={formData.status.toString()}
              onChange={handleSelectChange}
              required
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </CFormSelect>
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="anyTag">Any Tag</CFormLabel>
            <CFormSelect
              id="anyTag"
              name="anyTag"
              value={formData.anyTag.toString()}
              onChange={handleSelectChange}
              required
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </CFormSelect>
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="tag">Tag Name</CFormLabel>
            <CFormInput
              id="tag"
              name="tag"
              placeholder="Enter Tag Name (optional)"
              value={formData.tag}
              onChange={handleChange}
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="image">Vehicle Image</CFormLabel>
            <CFormInput
              id="image"
              name="image"
              type="file"
              onChange={handleImageChange}
            />
            {formData.previewImage && (
              <img
                src={formData.previewImage}
                alt="Vehicle Preview"
                style={{ marginTop: '10px', maxWidth: '200px' }}
              />
            )}
          </CCol>

          <CCol xs={12} className="mt-4">
            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? 'Please Wait...' : 'Update Vehicle'}
            </CButton>
          </CCol>
        </>
      }
    />
  );
};

export default EditParcelVehical;
