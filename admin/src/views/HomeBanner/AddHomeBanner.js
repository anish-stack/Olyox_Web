import React, { useState } from 'react';
import { CCol, CFormInput, CFormLabel, CButton } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const AddHomeBanner = () => {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);

    // Handle file input change
    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            toast.error('Image is required.');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        setLoading(true);
        try {
            const res = await axios.post('https://www.appapi.olyox.com/api/v1/admin/create_home_banner', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(res.data.message);
            setImage(null); // Reset the form
        } catch (error) {
            console.error('Error uploading banner:', error);
            toast.error(
                error?.response?.data?.message || 'Failed to create banner. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form
                heading="Add Home Banner"
                btnText="Back"
                btnURL="/all-home-banner"
                onSubmit={handleSubmit}
                formContent={
                    <>
                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="image">Upload Image</CFormLabel>
                            <CFormInput
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
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

export default AddHomeBanner;
