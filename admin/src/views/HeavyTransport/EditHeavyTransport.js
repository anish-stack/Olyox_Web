import React, { useState, useEffect } from 'react';
import {
    CCol, CFormInput, CFormLabel, CButton, CFormCheck, CImage, CFormSelect
} from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';
import { useParams } from 'react-router-dom';

const EditHeavyTransport = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [heavyVehicalTitle, setHeavyVehicalTitle] = useState([]);
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
        fetchHeavyTitles();
    }, []);

    const fetchHeavyTitles = async () => {
        try {
            const res = await axios.get('https://demoapi.olyox.com/api/v1/heavy/heavy-category');
            setHeavyVehicalTitle(res.data.data.reverse());
        } catch (error) {
            console.log("Error fetching title list:", error);
        }
    };

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
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleStatusChange = (e) => {
        setFormData((prev) => ({ ...prev, active: e.target.checked }));
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
            console.error('Update error:', error);
            toast.error('Update failed.');
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
                            <CFormSelect
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                            >
                                <option value="">Select Title</option>
                                {heavyVehicalTitle.map((item) => (
                                    <option key={item._id} value={item.title}>
                                        {item.title}
                                    </option>
                                ))}
                            </CFormSelect>
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
                                <CImage src={formData.existingImage} fluid width={200} alt="Current Vehicle" />
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
