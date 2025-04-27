import React, { useState, useEffect } from 'react';
import { CCol, CFormInput, CFormLabel, CFormSelect, CButton } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';
import { useParams } from 'react-router-dom';

const EditParcelCoupon = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    expirationDate: '',
    isActive: true,
  });

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await axios.get(`https://www.appapi.olyox.com/api/v1/parcel/parcel-coupon/${id}`);
        const data = res.data.data;
        setFormData({
          code: data.code,
          discount: data.discount,
          expirationDate: data.expirationDate ? data.expirationDate.split('T')[0] : '',
          isActive: data.isActive,
        });
      } catch (error) {
        console.error('Error fetching coupon:', error);
        toast.error('Failed to fetch coupon details.');
      }
    };
    fetchCoupon();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'discount' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === 'true',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(`https://www.appapi.olyox.com/api/v1/parcel/parcel-coupon/${id}`, formData);
      toast.success(res.data.message || 'Coupon updated successfully');
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error(error?.response?.data?.message || 'Failed to update coupon.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      heading="Edit Parcel Coupon"
      btnText="Back"
      btnURL="/all-parcel-coupon"
      onSubmit={handleSubmit}
      formContent={
        <>
          <CCol md={12}>
            <CFormLabel htmlFor="code">Coupon Code</CFormLabel>
            <CFormInput
              id="code"
              name="code"
              placeholder="Enter Coupon Code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="discount">Discount (%)</CFormLabel>
            <CFormInput
              id="discount"
              name="discount"
              type="number"
              placeholder="Enter Discount Percentage"
              value={formData.discount}
              onChange={handleChange}
              min={0}
              max={100}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="expirationDate">Expiration Date</CFormLabel>
            <CFormInput
              id="expirationDate"
              name="expirationDate"
              type="date"
              value={formData.expirationDate}
              onChange={handleChange}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="isActive">Status</CFormLabel>
            <CFormSelect
              id="isActive"
              name="isActive"
              value={formData.isActive.toString()}
              onChange={handleSelectChange}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </CFormSelect>
          </CCol>

          <CCol xs={12} className="mt-4">
            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? 'Please Wait...' : 'Update Coupon'}
            </CButton>
          </CCol>
        </>
      }
    />
  );
};

export default EditParcelCoupon;
