import React, { useState, useEffect } from 'react';
import { CCol, CFormInput, CFormLabel, CButton } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';
import { useParams } from 'react-router-dom';

const EditCoupon = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discount: '',
        expiryDate: '',
        active: true,
    });

    useEffect(() => {
        const fetchCoupon = async () => {
            try {
                const res = await axios.get(`https://www.appapi.olyox.com/api/v1/admin/getSingleCoupon/${id}`);
                setFormData({
                    code: res.data.data.code,
                    discount: res.data.data.discount,
                    expiryDate: res.data.data.expiryDate.split('T')[0], // Format date
                    active: res.data.data.active,
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
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put(`https://www.appapi.olyox.com/api/v1/admin/updateCoupon/${id}`, formData);
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
            heading="Edit Coupon"
            btnText="Back"
            btnURL="/coupon/all_coupon"
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
                        />
                    </CCol>
                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="expiryDate">Expiry Date</CFormLabel>
                        <CFormInput
                            id="expiryDate"
                            name="expiryDate"
                            type="date"
                            value={formData.expiryDate}
                            onChange={handleChange}
                        />
                    </CCol>
                    {/* <CCol md={12} className="mt-3">
                        <CFormCheckbox
                            id="active"
                            name="active"
                            checked={formData.active}
                            onChange={() => setFormData({ ...formData, active: !formData.active })}
                        >
                            Active
                        </CFormCheckbox>
                    </CCol> */}
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

export default EditCoupon;