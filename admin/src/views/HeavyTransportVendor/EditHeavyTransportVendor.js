import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCol, CFormInput, CFormLabel, CButton, CFormCheck, CFormSelect } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const EditHeavyTransportVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    call_timing: {
      start_time: '',
      end_time: ''
    },
    status: 'Active',
    is_blocked: false,
    is_working: false,
    profile_shows_at_position: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleCallTimingChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      call_timing: {
        ...prev.call_timing,
        [name]: value,
      }
    }));
  };

  const fetchPartnerData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://www.appapi.olyox.com/api/v1/heavy/heavy-vehicle-profile/${id}`);
      const partner = res.data.data;

      setFormData({
        name: partner.name || '',
        email: partner.email || '',
        phone_number: partner.phone_number || '',
        call_timing: partner.call_timing || { start_time: '', end_time: '' },
        status: partner.status || 'Active',
        is_blocked: !!partner.is_blocked,
        is_working: !!partner.is_working,
        profile_shows_at_position: partner.profile_shows_at_position || 1,
      });
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to fetch partner data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone_number, call_timing, status, is_blocked, is_working, profile_shows_at_position } = formData;

    if (!name || !email || !phone_number) {
      toast.error('Name, email, and phone number are required.');
      return;
    }

    const payload = {
      name,
      email,
      phone_number,
      call_timing,
      status,
      is_blocked,
      is_working,
      profile_shows_at_position
    };

    setLoading(true);
    try {
      const res = await axios.put(
        `http://www.appapi.olyox.com/api/v1/heavy/heavy-vehicle-profile-update-by-admin/${id}`,
        payload
      );

      toast.success(res.data.message);
      navigate('/heavy/all-heavy-transport-vendor');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to update partner details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerData();
  }, [id]);

  return (
    <Form
      heading="Edit Heavy Transport Partner"
      btnText="Back"
      btnURL="/heavy/all-heavy-transport-vendor"
      onSubmit={handleSubmit}
      formContent={
        <>
          <CCol md={12} className="mt-2">
            <CFormLabel htmlFor="name">Partner Name</CFormLabel>
            <CFormInput id="name" name="name" value={formData.name} onChange={handleChange} required />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="email">Email</CFormLabel>
            <CFormInput id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="phone_number">Phone Number</CFormLabel>
            <CFormInput id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="status">Status</CFormLabel>
            <CFormSelect id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </CFormSelect>
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="profile_shows_at_position">Profile Position</CFormLabel>
            <CFormInput
              type="number"
              id="profile_shows_at_position"
              name="profile_shows_at_position"
              min="1"
              value={formData.profile_shows_at_position}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormCheck id="is_blocked" name="is_blocked" label="Is Blocked" checked={formData.is_blocked} onChange={handleCheckboxChange} />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormCheck id="is_working" name="is_working" label="Is Working" checked={formData.is_working} onChange={handleCheckboxChange} />
          </CCol>
          <CCol md={12} className="mt-4">
            <h5>Call Timing</h5>
            <div className="d-flex gap-3">
              <CCol md={6}>
                <CFormLabel htmlFor="start_time">Start Time</CFormLabel>
                <CFormInput id="start_time" name="start_time" value={formData.call_timing.start_time} onChange={handleCallTimingChange} />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="end_time">End Time</CFormLabel>
                <CFormInput id="end_time" name="end_time" value={formData.call_timing.end_time} onChange={handleCallTimingChange} />
              </CCol>
            </div>
          </CCol>
          <CCol md={12} className="mt-4">
            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Partner'}
            </CButton>
          </CCol>
        </>
      }
    />
  );
};

export default EditHeavyTransportVendor;