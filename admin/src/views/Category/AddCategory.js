import React, { useState } from 'react';
import { CCol, CFormInput, CFormLabel, CButton } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

function AddCategory() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        icon: '',
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:7000/api/v1/categories_create', formData);
            toast.success(res.data.message);
            // Reset the form
            setFormData({
                title: '',
                icon: '',
            });
        } catch (error) {
            console.error('Error submitting category:', error);
            toast.error(
                error?.response?.data?.message || 'Failed to add the category. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form
                heading="Add Category"
                btnText="Back"
                btnURL="/category/all_category"
                onSubmit={handleSubmit}
                formContent={
                    <>
                        <CCol md={12}>
                            <CFormLabel htmlFor="title">Title</CFormLabel>
                            <CFormInput
                                id="title"
                                name="title"
                                placeholder="Enter Category title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="icon">Icon</CFormLabel>
                            <CFormInput
                                id="icon"
                                name="icon"
                                placeholder="Enter Category icon URL"
                                value={formData.icon}
                                onChange={handleChange}
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
}

export default AddCategory;
