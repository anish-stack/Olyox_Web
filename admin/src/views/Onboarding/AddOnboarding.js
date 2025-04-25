import React, { useState } from 'react';
import { CCol, CFormInput, CFormLabel, CButton, CFormTextarea } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const AddOnboarding = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        slug: '',
        image: null, // for the image file
    });
    

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    // Handle file change (image upload)
    const handleFileChange = (e) => {
        setFormData((prevFormData) => ({ ...prevFormData, image: e.target.files[0] }));
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { title, description, slug, image } = formData;

        // Validate required fields
        if (!title || !description || !slug || !image) {
            toast.error('All fields (title, description, slug, image) are required.');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('title', title);
        formDataToSend.append('description', description);
        formDataToSend.append('slug', slug);
        formDataToSend.append('image', image); // Append the image file

        setLoading(true);
        try {
            const res = await axios.post('https://www.appapi.olyox.com/api/v1/admin/create_onboarding_slide', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(res.data.message);
            // Reset the form
            setFormData({
                title: '',
                description: '',
                slug: '',
                image: null,
            });
        } catch (error) {
            console.error('Error submitting onboarding slide:', error);
            toast.error(
                error?.response?.data?.message || 'Failed to create the onboarding slide. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form
                heading="Add Onboarding Slide"
                btnText="Back"
                btnURL="/onboarding/all-onboarding"
                onSubmit={handleSubmit}
                formContent={
                    <>
                        <CCol md={12}>
                            <CFormLabel htmlFor="title">Title</CFormLabel>
                            <CFormInput
                                id="title"
                                name="title"
                                placeholder="Enter onboarding title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="slug">Slug</CFormLabel>
                            <CFormInput
                                id="slug"
                                name="slug"
                                placeholder="Enter onboarding slug"
                                value={formData.slug}
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
                            <CFormLabel htmlFor="image">Image</CFormLabel>
                            <CFormInput
                                type="file"
                                id="image"
                                name="image"
                                onChange={handleFileChange}
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

export default AddOnboarding;
