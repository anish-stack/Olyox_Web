import React, { useEffect, useState } from 'react';
import { CCol, CFormInput, CFormLabel, CButton, CFormTextarea, CFormCheck, CInputGroup, CInputGroupText } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const AddHeavyTransport = () => {
    const [loading, setLoading] = useState(false);
    const [heavyVehicalTitle, setHeavyVehicalTitle] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        backgroundColour: '#ffffff',
        active: true,
        image: null,
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    // Handle file change
    const handleFileChange = (e) => {
        setFormData((prevFormData) => ({ ...prevFormData, image: e.target.files[0] }));
    };

    // Handle checkbox change for status
    const handleStatusChange = (e) => {
        setFormData((prevFormData) => ({ ...prevFormData, active: e.target.checked }));
    };

    const fetchVehicalTitle = async () => {
        try {
            const { data } = await axios.get('http://localhost:3100/api/v1/heavy/heavy-category');
            setHeavyVehicalTitle(data.data.reverse());
        } catch (error) {
            console.log("Internal server error", error)
        }
    }

    useEffect(() => {
        fetchVehicalTitle();
    }, [])

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { title, category, backgroundColour, active, image } = formData;

        // Validate required fields
        if (!category || !backgroundColour || !image) {
            toast.error('All fields including image are required.');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('title', selectedTitle);
        formDataToSend.append('category', category);
        formDataToSend.append('backgroundColour', backgroundColour);
        formDataToSend.append('active', active);
        formDataToSend.append('image', image);

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3100/api/v1/admin/create-heavy', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(res.data.message);
            // Reset the form
            setFormData({
                title: '',
                category: '',
                backgroundColour: '#ffffff',
                active: true,
                image: null,
            });
        } catch (error) {
            console.error('Error submitting heavy transport:', error);
            toast.error(
                error?.response?.data?.message || 'Failed to create heavy transport. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form
                heading="Add Heavy Transport"
                btnText="Back"
                btnURL="/all-heacy-transport-option"
                onSubmit={handleSubmit}
                formContent={
                    <>
                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="title">Title</CFormLabel>
                            <select
                                className="form-select"
                                value={selectedTitle}
                                onChange={(e) => setSelectedTitle(e.target.value)}
                            >
                                <option value="">-- Select a Title --</option>
                                {heavyVehicalTitle.map((item) => (
                                    <option key={item._id} value={item.title}>
                                        {item.title}
                                    </option>
                                ))}
                            </select>
                        </CCol>
                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="category">Category</CFormLabel>
                            <CFormInput
                                id="category"
                                name="category"
                                placeholder="Enter category"
                                value={formData.category}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="backgroundColour">Background Colour</CFormLabel>
                            <CFormInput
                                type="color"
                                id="backgroundColour"
                                name="backgroundColour"
                                value={formData.backgroundColour}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="image">Upload Image</CFormLabel>
                            <CFormInput
                                type="file"
                                id="image"
                                name="image"
                                onChange={handleFileChange}
                            />
                        </CCol>
                        <CCol md={12} className="mt-3">
                            <CFormCheck
                                type="checkbox"
                                id="active"
                                name="active"
                                label="Active"
                                checked={formData.active}
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

export default AddHeavyTransport;
