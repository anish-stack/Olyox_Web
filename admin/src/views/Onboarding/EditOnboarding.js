import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCol, CFormInput, CFormLabel, CButton, CFormTextarea } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const EditOnboarding = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        slug: '',
        image: null, // for the image file
        existingImageUrl: '', // to store the existing image URL
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

    // Fetch existing onboarding slide data
    const handleFetchSlide = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`https://www.appapi.olyox.com/api/v1/admin/get_single_onboarding_slides/${id}`);
            setFormData({
                title: data.data.title,
                description: data.data.description,
                slug: data.data.slug,
                existingImageUrl: data.data.imageUrl.image, // existing image URL
            });
        } catch (error) {
            console.error('Error fetching onboarding slide:', error);
            toast.error(
                error?.response?.data?.message || 'Failed to fetch the onboarding slide. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { title, description, slug, image } = formData;

        // Validate required fields
        if (!title || !description || !slug) {
            toast.error('All fields (title, description, slug) are required.');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('title', title);
        formDataToSend.append('description', description);
        formDataToSend.append('slug', slug);
        if (image) formDataToSend.append('image', image); // Append the new image if provided

        setLoading(true);
        try {
            const res = await axios.put(
                `https://www.appapi.olyox.com/api/v1/admin/update_onboarding_slide/${id}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            toast.success(res.data.message);
            navigate('/onboarding/all-onboarding');
        } catch (error) {
            console.error('Error updating onboarding slide:', error);
            toast.error(
                error?.response?.data?.message || 'Failed to update the onboarding slide. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetchSlide();
    }, []); // Fetch slide data only once when the component mounts

    return (
        <>
            <Form
                heading="Edit Onboarding Slide"
                btnText="Back"
                btnURL="/onboarding/all_onboarding"
                onSubmit={handleSubmit}
                formContent={
                    <>
                        <CCol md={12}>
                            <CFormLabel htmlFor="title">Title</CFormLabel>
                            <CFormInput
                                id="title"
                                name="title"
                                placeholder="Enter onboarding slide title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="slug">Slug</CFormLabel>
                            <CFormInput
                                id="slug"
                                name="slug"
                                placeholder="Enter onboarding slide slug"
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
                            {formData.existingImageUrl && (
                                <div>
                                    <img
                                        src={formData.existingImageUrl}
                                        alt="Existing image"
                                        style={{ maxWidth: '200px', marginTop: '10px' }}
                                    />
                                    <p>Existing Image</p>
                                </div>
                            )}
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
};

export default EditOnboarding;
