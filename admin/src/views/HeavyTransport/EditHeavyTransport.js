import React, { useState, useEffect } from 'react';
import { CCol, CFormInput, CFormLabel, CButton, CFormCheck, CImage } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';
import { useParams } from 'react-router-dom';

const EditHeavyTransport = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        backgroundColour: '#ffffff',
        active: true,
        image: null,
        existingImage: '',
    });

    useEffect(() => {
        handleFetchData();
    }, []);

    const handleFetchData = async () => {
        try {
            const res = await axios.get(`https://demoapi.olyox.com/api/v1/admin/get-single-heavy/${id}`);
            const data = res.data.data;
            setFormData({
                title: data.title,
                category: data.category,
                backgroundColour: data.backgroundColour,
                active: data.active,
                existingImage: data.image?.url || '',
            });
        } catch (error) {
            console.error('Error fetching heavy transport data:', error);
            toast.error(error?.response?.data?.message || 'Failed to fetch data.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prevFormData) => ({ ...prevFormData, image: e.target.files[0] }));
    };

    const handleStatusChange = (e) => {
        setFormData((prevFormData) => ({ ...prevFormData, active: e.target.checked }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, category, backgroundColour, active, image } = formData;

        if (!title || !category || !backgroundColour) {
            toast.error('Title, category, and background colour are required.');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('title', title);
        formDataToSend.append('category', category);
        formDataToSend.append('backgroundColour', backgroundColour);
        formDataToSend.append('active', active);
        if (image) formDataToSend.append('image', image);

        setLoading(true);
        try {
            const res = await axios.put(`https://demoapi.olyox.com/api/v1/admin/update-heavy/${id}`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(res.data.message);
            handleFetchData();
        } catch (error) {
            console.error('Error updating heavy transport:', error);
            toast.error(error?.response?.data?.message || 'Update failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form
                heading="Edit Heavy Transport"
                btnText="Back"
                btnURL="/all-heacy-transport-option"
                onSubmit={handleSubmit}
                formContent={
                    <>
                        <CCol md={12}>
                            <CFormLabel htmlFor="title">Title</CFormLabel>
                            <CFormInput id="title" name="title" value={formData.title} onChange={handleChange} />
                        </CCol>
                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="category">Category</CFormLabel>
                            <CFormInput id="category" name="category" value={formData.category} onChange={handleChange} />
                        </CCol>
                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="backgroundColour">Background Colour</CFormLabel>
                            <CFormInput type="color" id="backgroundColour" name="backgroundColour" value={formData.backgroundColour} onChange={handleChange} />
                        </CCol>
                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="image">Upload New Image</CFormLabel>
                            <CFormInput type="file" id="image" name="image" onChange={handleFileChange} />
                        </CCol>
                        {formData.existingImage && (
                            <CCol md={12} className="mt-3">
                                <CFormLabel>Current Image</CFormLabel>
                                <CImage src={formData.existingImage} fluid alt="Existing Heavy Transport" width={200} />
                            </CCol>
                        )}
                        <CCol md={12} className="mt-3">
                            <CFormCheck type="checkbox" id="active" name="active" label="Active" checked={formData.active} onChange={handleStatusChange} />
                        </CCol>
                        <CCol xs={12} className="mt-4">
                            <CButton color="primary" type="submit" disabled={loading}>
                                {loading ? 'Updating...' : 'Update'}
                            </CButton>
                        </CCol>
                    </>
                }
            />
        </>
    );
};

export default EditHeavyTransport;
