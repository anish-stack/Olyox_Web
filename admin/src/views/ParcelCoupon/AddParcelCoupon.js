import React, { useState } from 'react';
import { CCol, CFormInput, CFormLabel, CButton, CFormSelect } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const AddParcelCoupon = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discount: '',
        expirationDate: '',
        isActive: true,
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === 'isActive' ? value === 'true' : value,
        }));
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('https://www.appapi.olyox.com/api/v1/parcel/parcel-coupon', formData);
            toast.success(res.data.message);
            // Reset the form
            setFormData({
                code: '',
                discount: '',
                expirationDate: '',
                isActive: true,
            });
        } catch (error) {
            console.error('Error submitting coupon:', error);
            toast.error(error?.response?.data?.message || 'Failed to add the coupon. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form
                heading="Add Coupon"
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
                                placeholder="Enter coupon code"
                                value={formData.code}
                                onChange={handleChange}
                            />
                        </CCol>

                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="discount">Discount (%)</CFormLabel>
                            <CFormInput
                                id="discount"
                                name="discount"
                                type="number"
                                placeholder="Enter discount percentage"
                                value={formData.discount}
                                onChange={handleChange}
                                min={0}
                                max={100}
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
                            />
                        </CCol>

                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="isActive">Status</CFormLabel>
                            <CFormSelect
                                id="isActive"
                                name="isActive"
                                value={formData.isActive.toString()}
                                onChange={handleChange}
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </CFormSelect>
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

export default AddParcelCoupon;
