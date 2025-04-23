import React, { useState } from 'react';
import { CCol, CFormInput, CFormLabel, CButton, CFormTextarea } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const AddCarList = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        description: '',
        time: '',
        priceRange: '',
        status: false, // Default status is inactive
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

        const { name, type, description, time, priceRange, status } = formData;

        // Validate required fields
        if (!name || !type || !description || !time || !priceRange) {
            toast.error('All fields (name, type, description, time, price range) are required.');
            return;
        }

        const payload = {
            name,
            type,
            description,
            time,
            priceRange,
            // status,
        };

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3100/api/v1/admin/createSuggestion', payload);
            toast.success(res.data.message);
            // Reset the form
            setFormData({
                name: '',
                type: '',
                description: '',
                time: '',
                priceRange: '',
                // status: false,
            });
        } catch (error) {
            console.error('Error submitting ride suggestion:', error);
            toast.error(
                error?.response?.data?.message || 'Failed to create the ride suggestion. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form
                heading="Add Ride Suggestion"
                btnText="Back"
                btnURL="/cars/all-cars-list"
                onSubmit={handleSubmit}
                formContent={
                    <>
                        <CCol md={12}>
                            <CFormLabel htmlFor="name">Name</CFormLabel>
                            <CFormInput
                                id="name"
                                name="name"
                                placeholder="Enter ride name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="type">Type</CFormLabel>
                            <CFormInput
                                id="type"
                                name="type"
                                placeholder="Enter ride type"
                                value={formData.type}
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
                            <CFormLabel htmlFor="time">Time</CFormLabel>
                            <CFormInput
                                id="time"
                                name="time"
                                placeholder="Enter ride time"
                                value={formData.time}
                                onChange={handleChange}
                            />
                        </CCol>
                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="priceRange">Price Range</CFormLabel>
                            <CFormInput
                                id="priceRange"
                                name="priceRange"
                                placeholder="Enter price range"
                                value={formData.priceRange}
                                onChange={handleChange}
                            />
                        </CCol>
                        {/* <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="status">Active Status</CFormLabel>
                            <CFormInput
                                type="checkbox"
                                id="status"
                                name="status"
                                checked={formData.status}
                                onChange={handleStatusChange}
                            />
                            <div>
                                <small>{formData.status ? 'This ride is active' : 'This ride is inactive'}</small>
                            </div>
                        </CCol> */}
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

export default AddCarList;
