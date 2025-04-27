import React, { useState } from 'react';
import { CCol, CFormInput, CFormLabel, CButton, CFormSelect } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const AddBonusCoupon = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    requiredHours: '',
    bonusCouponCode: '',
    bonusType: 'percentage', // default
    bonusValue: '',
    bonusStatus: 'active', // default
    any_required_field: [], // array of strings
    newCondition: '', // temporary for adding new condition
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCondition = () => {
    if (formData.newCondition.trim()) {
      setFormData((prev) => ({
        ...prev,
        any_required_field: [...prev.any_required_field, prev.newCondition.trim()],
        newCondition: '',
      }));
    }
  };

  const handleDeleteCondition = (index) => {
    setFormData((prev) => ({
      ...prev,
      any_required_field: prev.any_required_field.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        requiredHours: Number(formData.requiredHours),
        bonusCouponCode: formData.bonusCouponCode,
        bonusType: formData.bonusType,
        bonusValue: Number(formData.bonusValue),
        bonusStatus: formData.bonusStatus,
        any_required_field: formData.any_required_field,
      };

      const res = await axios.post('https://www.appapi.olyox.com/api/v1/admin/admin/bonuses', payload);

      toast.success(res?.data?.message || 'Bonus created successfully!');

      setFormData({
        requiredHours: '',
        bonusCouponCode: '',
        bonusType: 'percentage',
        bonusValue: '',
        bonusStatus: 'active',
        any_required_field: [],
        newCondition: '',
      });
    } catch (error) {
      console.error('Error submitting bonus:', error);
      toast.error(error?.response?.data?.message || 'Failed to add the bonus. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form
        heading="Add Bonus Coupon"
        btnText="Back"
        btnURL="/all-bonus-coupon"
        onSubmit={handleSubmit}
        formContent={
          <>
            <CCol md={12}>
              <CFormLabel htmlFor="bonusCouponCode">Coupon Code</CFormLabel>
              <CFormInput
                id="bonusCouponCode"
                name="bonusCouponCode"
                placeholder="Enter bonus coupon code"
                value={formData.bonusCouponCode}
                onChange={handleChange}
              />
            </CCol>

            <CCol md={12} className="mt-3">
              <CFormLabel htmlFor="bonusType">Bonus Type</CFormLabel>
              <CFormSelect
                id="bonusType"
                name="bonusType"
                value={formData.bonusType}
                onChange={handleChange}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </CFormSelect>
            </CCol>

            <CCol md={12} className="mt-3">
              <CFormLabel htmlFor="bonusValue">Bonus Value</CFormLabel>
              <CFormInput
                id="bonusValue"
                name="bonusValue"
                type="number"
                placeholder="Enter bonus value"
                value={formData.bonusValue}
                onChange={handleChange}
                min={0}
              />
            </CCol>

            <CCol md={12} className="mt-3">
              <CFormLabel htmlFor="requiredHours">Required Hours</CFormLabel>
              <CFormInput
                id="requiredHours"
                name="requiredHours"
                type="number"
                placeholder="Enter required working hours"
                value={formData.requiredHours}
                onChange={handleChange}
                min={0}
              />
            </CCol>

            <CCol md={12} className="mt-3">
              <CFormLabel htmlFor="bonusStatus">Status</CFormLabel>
              <CFormSelect
                id="bonusStatus"
                name="bonusStatus"
                value={formData.bonusStatus}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </CFormSelect>
            </CCol>

            <CCol md={12} className="mt-3">
              <CFormLabel>Conditions (Optional)</CFormLabel>
              <div className="d-flex">
                <CFormInput
                  name="newCondition"
                  placeholder="Write a new condition..."
                  value={formData.newCondition}
                  onChange={handleChange}
                />
                <CButton color="success" className="ms-2" onClick={handleAddCondition}>
                  Add
                </CButton>
              </div>
              {formData.any_required_field.length > 0 && (
                <ul className="mt-2">
                  {formData.any_required_field.map((item, index) => (
                    <li key={index} className="d-flex align-items-center justify-content-between">
                      <span>{item}</span>
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleDeleteCondition(index)}
                      >
                        Delete
                      </CButton>
                    </li>
                  ))}
                </ul>
              )}
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
};

export default AddBonusCoupon;
