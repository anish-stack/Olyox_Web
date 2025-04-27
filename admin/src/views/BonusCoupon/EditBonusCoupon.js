import React, { useState, useEffect } from 'react';
import { CCol, CFormInput, CFormLabel, CFormSelect, CButton } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';
import { useParams } from 'react-router-dom';

const EditBonusCoupon = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        requiredHours: '',
        bonusCouponCode: '',
        bonusType: '',
        bonusValue: '',
        bonusStatus: '',
        any_required_field: [],
        newCondition: '', // for the input field of new condition
    });

    useEffect(() => {
        const fetchBonus = async () => {
            try {
                const res = await axios.get(`https://www.appapi.olyox.com/api/v1/admin/admin/bonuses/${id}`);
                const data = res.data.data;
                setFormData({
                    requiredHours: data.requiredHours || '',
                    bonusCouponCode: data.bonusCouponCode || '',
                    bonusType: data.bonusType || '',
                    bonusValue: data.bonusValue || '',
                    bonusStatus: data.bonusStatus || '',
                    any_required_field: data.any_required_field || [],
                    newCondition: '',
                });
            } catch (error) {
                console.error('Error fetching bonus:', error);
                toast.error('Failed to fetch bonus details.');
            }
        };
        fetchBonus();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'requiredHours' || name === 'bonusValue' ? Number(value) : value,
        }));
    };

    const handleAddCondition = () => {
        if (formData.newCondition.trim() !== '') {
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
                ...formData,
                anyRequiredField: formData.any_required_field, // for backend compatibility
            };
            delete payload.newCondition; // don't send this to backend
            const res = await axios.put(`https://www.appapi.olyox.com/api/v1/admin/admin/bonuses/${id}`, payload);
            toast.success(res.data.message || 'Bonus updated successfully!');
        } catch (error) {
            console.error('Error updating bonus:', error);
            toast.error(error?.response?.data?.message || 'Failed to update bonus.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            heading="Edit Bonus Coupon"
            btnText="Back"
            btnURL="/all-bonus-coupon"
            onSubmit={handleSubmit}
            formContent={
                <>
                    

                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="bonusCouponCode">Bonus Coupon Code</CFormLabel>
                        <CFormInput
                            id="bonusCouponCode"
                            name="bonusCouponCode"
                            placeholder="Enter bonus coupon code"
                            value={formData.bonusCouponCode}
                            onChange={handleChange}
                            required
                        />
                    </CCol>

                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="bonusType">Bonus Type</CFormLabel>
                        <CFormSelect
                            id="bonusType"
                            name="bonusType"
                            value={formData.bonusType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Bonus Type</option>
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed</option>
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
                            required
                        />
                    </CCol>
                    <CCol md={12}>
                        <CFormLabel htmlFor="requiredHours">Required Hours</CFormLabel>
                        <CFormInput
                            id="requiredHours"
                            name="requiredHours"
                            type="number"
                            placeholder="Enter required hours"
                            value={formData.requiredHours}
                            onChange={handleChange}
                            required
                        />
                    </CCol>

                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="bonusStatus">Bonus Status</CFormLabel>
                        <CFormSelect
                            id="bonusStatus"
                            name="bonusStatus"
                            value={formData.bonusStatus}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </CFormSelect>
                    </CCol>

                    {/* New: Conditions Section */}
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
                            {loading ? 'Please Wait...' : 'Update Bonus'}
                        </CButton>
                    </CCol>
                </>
            }
        />
    );
};

export default EditBonusCoupon;
