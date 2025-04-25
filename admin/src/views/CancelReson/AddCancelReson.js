import React, { useState } from 'react';
import { CCol, CFormInput, CFormLabel, CButton, CFormTextarea, CFormCheck } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const AddCancelReason = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: true,
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    // Handle checkbox change for status
    const handleStatusChange = (e) => {
        setFormData((prevFormData) => ({ ...prevFormData, status: e.target.checked }));
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, description, status } = formData;

        // Validate required fields
        if (!name) {
            toast.error('Name is required.');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('http://www.appapi.olyox.com/api/v1/admin/cancel-reasons', { name, description, status: status ? 'active' : 'inactive' });
            toast.success(res.data.message);
            // Reset the form
            setFormData({
                name: '',
                description: '',
                status: true,
            });
        } catch (error) {
            console.error('Error submitting cancel reason:', error);
            toast.error(error?.response?.data?.message || 'Failed to create cancel reason. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form
                heading="Add Cancel Reason"
                btnText="Back"
                btnURL="/all-cancel-reason"
                onSubmit={handleSubmit}
                formContent={
                    <>
                        <CCol md={12}>
                            <CFormLabel htmlFor="name">Name</CFormLabel>
                            <CFormInput
                                id="name"
                                name="name"
                                placeholder="Enter cancel reason name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="description">Description</CFormLabel>
                            <CFormTextarea
                                id="description"
                                name="description"
                                placeholder="Enter description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={12} className="mt-3">
                            <CFormCheck
                                type="checkbox"
                                id="status"
                                name="status"
                                label="Active"
                                checked={formData.status}
                                onChange={handleStatusChange}
                            />
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

export default AddCancelReason;
