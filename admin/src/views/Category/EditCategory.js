import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCol, CFormInput, CFormLabel, CButton } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

function EditCategory() {
    const { id } = useParams();
    const navigate = useNavigate();
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

    // Fetch existing category data
    const handleFetchCategory = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`https://api.olyox.com/api/v1/categories/${id}`);
            setFormData({
                title: data.data.title,
                icon: data.data.icon,
            });
        } catch (error) {
            console.error('Error fetching category:', error);
            toast.error(
                error?.response?.data?.message || 'Failed to fetch category. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            const res = await axios.put(`https://api.olyox.com/api/v1/categories/${id}`, formData);
            toast.success(res.data.message);
            navigate('/category/all_category');
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error(
                error?.response?.data?.message || 'Failed to update the category. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetchCategory();
    }, []); // Fetch data only once when the component mounts

    return (
        <>
            <Form
                heading="Edit Category"
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
                                {loading ? 'Please Wait...' : 'Update'}
                            </CButton>
                        </CCol>
                    </>
                }
            />
        </>
    );
}

export default EditCategory;
