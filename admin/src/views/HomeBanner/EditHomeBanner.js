import React, { useState, useEffect } from 'react';
import {
  CCol, CFormInput, CFormLabel, CButton, CFormCheck, CImage
} from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';
import { useParams } from 'react-router-dom';

const EditHomeBanner = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    is_active: true,
    image: null,
    existingImage: '',
  });

  useEffect(() => {
    fetchBannerData();
  }, []);

  const fetchBannerData = async () => {
    try {
      const res = await axios.get(`https://www.appapi.olyox.com/api/v1/admin/get_single_home_banner/${id}`);
      const data = res.data.data;
      setFormData({
        is_active: data.is_active,
        existingImage: data.image?.url || '',
        image: null,
      });
    } catch (error) {
      console.error('Error fetching banner:', error);
      toast.error('Failed to fetch banner.');
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({ ...prev, is_active: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('is_active', formData.is_active);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    setLoading(true);
    try {
      const res = await axios.put(`https://www.appapi.olyox.com/api/v1/admin/update_home_banner/${id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(res.data.message);
      fetchBannerData(); // Refetch to update view
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error('Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form
        heading="Edit Home Banner"
        btnText="Back"
        btnURL="/all-home-banner"
        onSubmit={handleSubmit}
        formContent={
          <>
            <CCol md={12} className="mt-3">
              <CFormLabel htmlFor="image">Upload New Image</CFormLabel>
              <CFormInput type="file" id="image" name="image" onChange={handleFileChange} />
            </CCol>
            {formData.existingImage && (
              <CCol md={12} className="mt-3">
                <CFormLabel>Current Image</CFormLabel>
                <CImage src={formData.existingImage} fluid width={200} alt="Current Banner" />
              </CCol>
            )}
            <CCol md={12} className="mt-3">
              <CFormCheck
                type="checkbox"
                id="is_active"
                name="is_active"
                label="Active"
                checked={formData.is_active}
                onChange={handleStatusChange}
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
    </>
  );
};

export default EditHomeBanner;
