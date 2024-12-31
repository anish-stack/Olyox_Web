import React, { useState } from 'react';
import { CCol, CFormInput, CFormLabel, CButton, CFormTextarea, CFormSelect } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

function AddMembership() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    validityDays: '',
    level: '', // Default empty, will be a number
    includes: '',
    whatIsThis: '',
    active: true,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Handle checkbox toggle for 'active'
  // const handleActiveChange = (e) => {
  //     setFormData((prevFormData) => ({ ...prevFormData, active: e.target.checked }));
  // };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure `includes` is an array of strings (split by commas)
    const includesArray = formData.includes.split(',').map(item => item.trim());

    const formDataToSend = { ...formData, includes: includesArray };

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:7000/api/v1/membership-plans-create', formDataToSend);
      toast.success(res.data.message);
      // Reset the form
      setFormData({
        title: '',
        price: '',
        description: '',
        validityDays: '',
        level: '', // Reset to empty
        includes: '',
        whatIsThis: '',
        active: true,
      });
    } catch (error) {
      console.error('Error submitting membership plan:', error);
      toast.error(error?.response?.data?.message || 'Failed to add the membership plan. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Form
        heading="Add Membership Plan"
        btnText="Back"
        btnURL="/membership-plans"
        onSubmit={handleSubmit}
        formContent={
          <>
            <CCol md={12}>
              <CFormLabel htmlFor="title">Title</CFormLabel>
              <CFormInput
                id="title"
                name="title"
                placeholder="Enter Membership Plan title"
                value={formData.title}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={12} className="mt-3">
              <CFormLabel htmlFor="price">Price</CFormLabel>
              <CFormInput
                id="price"
                name="price"
                type="number"
                placeholder="Enter Membership Plan price"
                value={formData.price}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={12} className="mt-3">
              <CFormLabel htmlFor="description">Description</CFormLabel>
              <CFormTextarea
                id="description"
                name="description"
                placeholder="Enter Membership Plan description"
                value={formData.description}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={12} className="mt-3">
              <CFormLabel htmlFor="validityDays">Validity (in days)</CFormLabel>
              <CFormInput
                id="validityDays"
                name="validityDays"
                type="number"
                placeholder="Enter validity in days"
                value={formData.validityDays}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={12} className="mt-3">
              <CFormLabel htmlFor="level">Level</CFormLabel>
              <CFormSelect
                id="level"
                name="level"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
              >
                <option value="">Select Level</option>
                <option value="1">Basic</option>
                <option value="2">Premium</option>
                <option value="3">VIP</option>
              </CFormSelect>
            </CCol>
            <CCol md={12} className="mt-3">
              <CFormLabel htmlFor="includes">Includes(use comma to separate)</CFormLabel>
              <CFormTextarea
                id="includes"
                name="includes"
                placeholder="Enter included features"
                value={formData.includes}
                onChange={handleChange}
              />
            </CCol>
            <CCol md={12} className="mt-3">
              <CFormLabel htmlFor="whatIsThis">What is this?</CFormLabel>
              <CFormTextarea
                id="whatIsThis"
                name="whatIsThis"
                placeholder="Enter details about the plan"
                value={formData.whatIsThis}
                onChange={handleChange}
              />
            </CCol>
            {/* <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="active">Active</CFormLabel>
                            <CFormInput
                                type="checkbox"
                                id="active"
                                name="active"
                                checked={formData.active}
                                onChange={handleActiveChange}
                            />
                        </CCol> */}
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

export default AddMembership;
