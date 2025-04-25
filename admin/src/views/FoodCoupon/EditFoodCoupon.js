import React, { useState, useEffect } from 'react';
import {
  CCol,
  CFormInput,
  CFormLabel,
  CButton,
  CFormSelect,
} from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';
import { useParams } from 'react-router-dom';

const EditFoodCoupon = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    Coupon_Code: '',
    min_order_amount: '',
    max_discount: '',
    discount_type: '',
    discount: '',
    active: true,
  });

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await axios.get(`https://www.appapi.olyox.com/api/v1/tiffin/tiffin-coupons/${id}`);
        const coupon = res.data.data;

        setFormData({
          title: coupon.title,
          Coupon_Code: coupon.Coupon_Code,
          min_order_amount: coupon.min_order_amount,
          max_discount: coupon.max_discount,
          discount_type: coupon.discount_type,
          discount: coupon.discount,
          active: coupon.active,
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === 'active' ? value === 'true' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(`https://www.appapi.olyox.com/api/v1/tiffin/tiffin-coupons/${id}`, formData);
      toast.success(res.data.message);
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error(error?.response?.data?.message || 'Failed to update coupon.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      heading="Edit Food Coupon"
      btnText="Back"
      btnURL="/all-food-coupon"
      onSubmit={handleSubmit}
      formContent={
        <>
          <CCol md={12}>
            <CFormLabel htmlFor="title">Title</CFormLabel>
            <CFormInput
              id="title"
              name="title"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="Coupon_Code">Coupon Code</CFormLabel>
            <CFormInput
              id="Coupon_Code"
              name="Coupon_Code"
              placeholder="Enter unique coupon code"
              value={formData.Coupon_Code}
              onChange={handleChange}
              required
            //   disabled // Usually we don't allow editing unique codes
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="min_order_amount">Min Order Amount</CFormLabel>
            <CFormInput
              id="min_order_amount"
              name="min_order_amount"
              type="number"
              placeholder="Enter minimum order amount"
              value={formData.min_order_amount}
              onChange={handleChange}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="max_discount">Max Discount</CFormLabel>
            <CFormInput
              id="max_discount"
              name="max_discount"
              type="number"
              placeholder="Enter maximum discount"
              value={formData.max_discount}
              onChange={handleChange}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="discount_type">Discount Type</CFormLabel>
            <CFormSelect
              id="discount_type"
              name="discount_type"
              value={formData.discount_type}
              onChange={handleChange}
              required
            >
              <option value="">Select discount type</option>
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </CFormSelect>
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="discount">Discount Value</CFormLabel>
            <CFormInput
              id="discount"
              name="discount"
              type="number"
              placeholder="Enter discount value"
              value={formData.discount}
              onChange={handleChange}
              required
            />
          </CCol>

          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="active">Status</CFormLabel>
            <CFormSelect
              id="active"
              name="active"
              value={formData.active.toString()}
              onChange={handleChange}
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

export default EditFoodCoupon;
