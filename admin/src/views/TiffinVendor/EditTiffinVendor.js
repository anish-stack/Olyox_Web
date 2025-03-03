import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCol, CFormInput, CFormLabel, CButton, CFormTextarea } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const EditTiffinVendor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        restaurant_name: '',
        restaurant_phone: '',
        openingHours: '',
        restaurant_contact: '',
        restaurant_category: '',
        restaurant_fssai: '',
        priceForTwoPerson: '',
        minDeliveryTime: '',
        minPrice: '',
        existingImages: {
            restaurant_fssai_image: '',
            restaurant_pan_image: '',
            restaurant_adhar_front_image: '',
            restaurant_adhar_back_image: '',
        },
        files: {
            restaurant_fssai_image: null,
            restaurant_pan_image: null,
            restaurant_adhar_front_image: null,
            restaurant_adhar_back_image: null,
        }
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    // Handle file change (multiple file uploads)
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            files: {
                ...prevFormData.files,
                [name]: files[0]
            }
        }));
    };

    // Fetch existing restaurant data
    const handleFetchRestaurant = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:3100/api/v1/tiffin/get_single_restaurant/${id}`);
            setFormData({
                restaurant_name: data.data.restaurant_name,
                restaurant_phone: data.data.restaurant_phone,
                openingHours: data.data.openingHours,
                restaurant_contact: data.data.restaurant_contact,
                restaurant_category: data.data.restaurant_category,
                restaurant_fssai: data.data.restaurant_fssai,
                priceForTwoPerson: data.data.priceForTwoPerson,
                minDeliveryTime: data.data.minDeliveryTime,
                minPrice: data.data.minPrice,
                existingImages: {
                    restaurant_fssai_image: data.data.restaurant_fssai_image?.url || '',
                    restaurant_pan_image: data.data.restaurant_pan_image?.url || '',
                    restaurant_adhar_front_image: data.data.restaurant_adhar_front_image?.url || '',
                    restaurant_adhar_back_image: data.data.restaurant_adhar_back_image?.url || '',
                }
            });
        } catch (error) {
            console.error('Error fetching restaurant data:', error);
            toast.error(error?.response?.data?.message || 'Failed to fetch the restaurant data.');
        } finally {
            setLoading(false);
        }
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const {
            restaurant_name,
            restaurant_phone,
            openingHours,
            restaurant_contact,
            restaurant_category,
            restaurant_fssai,
            priceForTwoPerson,
            minDeliveryTime,
            minPrice,
            files,
            existingImages
        } = formData;
    
        // Validate required fields
        if (!restaurant_name || !restaurant_phone || !restaurant_category || !restaurant_fssai) {
            toast.error('All required fields (restaurant name, phone, category, FSSAI) must be filled.');
            return;
        }
    
        const formDataToSend = new FormData();
        formDataToSend.append('restaurant_name', restaurant_name);
        formDataToSend.append('restaurant_phone', restaurant_phone);
        formDataToSend.append('openingHours', openingHours);
        formDataToSend.append('restaurant_contact', restaurant_contact);
        formDataToSend.append('restaurant_category', restaurant_category);
        formDataToSend.append('restaurant_fssai', restaurant_fssai);
        formDataToSend.append('priceForTwoPerson', priceForTwoPerson);
        formDataToSend.append('minDeliveryTime', minDeliveryTime);
        formDataToSend.append('minPrice', minPrice);
    
        // Ensure files and existingImages are valid objects
        const safeFiles = files || {};
        const safeExistingImages = existingImages || {};
    
        // Append new images if provided or keep existing ones
        Object.keys(safeFiles).forEach((fileKey) => {
            if (safeFiles[fileKey]) {
                formDataToSend.append(fileKey, safeFiles[fileKey]);
            } else if (safeExistingImages[fileKey]) {
                formDataToSend.append(fileKey, safeExistingImages[fileKey]);
            }
        });
    
        setLoading(true);
        try {
            const res = await axios.put(
                `http://localhost:3100/api/v1/tiffin/update_restaurant_details/${id}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            toast.success(res.data.message);
            // navigate('/onboarding/all-onboarding');
        } catch (error) {
            console.log('Error updating restaurant details:', error);
            toast.error(error?.response?.data?.message || 'Failed to update the restaurant details.');
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        handleFetchRestaurant();
    }, []); // Fetch restaurant data only once when the component mounts

    return (
        <Form
            heading="Edit Restaurant"
            btnText="Back"
            btnURL="/tiffin/all-tiffin-vendor"
            onSubmit={handleSubmit}
            formContent={
                <>
                    <CCol md={12}>
                        <CFormLabel htmlFor="restaurant_name">Restaurant Name</CFormLabel>
                        <CFormInput
                            id="restaurant_name"
                            name="restaurant_name"
                            placeholder="Enter restaurant name"
                            value={formData.restaurant_name}
                            onChange={handleChange}
                        />
                    </CCol>
                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="restaurant_phone">Phone</CFormLabel>
                        <CFormInput
                            id="restaurant_phone"
                            name="restaurant_phone"
                            placeholder="Enter phone number"
                            value={formData.restaurant_phone}
                            onChange={handleChange}
                        />
                    </CCol>
                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="restaurant_category">Category</CFormLabel>
                        <CFormInput
                            id="restaurant_category"
                            name="restaurant_category"
                            placeholder="Enter category"
                            value={formData.restaurant_category}
                            onChange={handleChange}
                        />
                    </CCol>
                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="restaurant_fssai">FSSAI</CFormLabel>
                        <CFormInput
                            id="restaurant_fssai"
                            name="restaurant_fssai"
                            placeholder="Enter FSSAI number"
                            value={formData.restaurant_fssai}
                            onChange={handleChange}
                        />
                    </CCol>
                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="priceForTwoPerson">Price For Two</CFormLabel>
                        <CFormInput
                            id="priceForTwoPerson"
                            name="priceForTwoPerson"
                            placeholder="Enter price for two people"
                            value={formData.priceForTwoPerson}
                            onChange={handleChange}
                        />
                    </CCol>
                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="minDeliveryTime">Minimum Delivery Time</CFormLabel>
                        <CFormInput
                            id="minDeliveryTime"
                            name="minDeliveryTime"
                            placeholder="Enter minimum delivery time"
                            value={formData.minDeliveryTime}
                            onChange={handleChange}
                        />
                    </CCol>
                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="minPrice">Minimum Price</CFormLabel>
                        <CFormInput
                            id="minPrice"
                            name="minPrice"
                            placeholder="Enter minimum price"
                            value={formData.minPrice}
                            onChange={handleChange}
                        />
                    </CCol>

                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="restaurant_fssai_image">FSSAI Image</CFormLabel>
                        <CFormInput
                            type="file"
                            id="restaurant_fssai_image"
                            name="restaurant_fssai_image"
                            onChange={handleFileChange}
                        />
                        {formData.existingImages.restaurant_fssai_image && (
                            <div>
                                <img
                                    src={formData.existingImages.restaurant_fssai_image}
                                    alt="FSSAI Image"
                                    style={{ maxWidth: '200px', marginTop: '10px' }}
                                />
                                <p>Existing FSSAI Image</p>
                            </div>
                        )}
                    </CCol>

                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="restaurant_pan_image">PAN Image</CFormLabel>
                        <CFormInput
                            type="file"
                            id="restaurant_pan_image"
                            name="restaurant_pan_image"
                            onChange={handleFileChange}
                        />
                        {formData.existingImages.restaurant_pan_image && (
                            <div>
                                <img
                                    src={formData.existingImages.restaurant_pan_image}
                                    alt="PAN Image"
                                    style={{ maxWidth: '200px', marginTop: '10px' }}
                                />
                                <p>Existing PAN Image</p>
                            </div>
                        )}
                    </CCol>

                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="restaurant_adhar_front_image">Aadhaar Front Image</CFormLabel>
                        <CFormInput
                            type="file"
                            id="restaurant_adhar_front_image"
                            name="restaurant_adhar_front_image"
                            onChange={handleFileChange}
                        />
                        {formData.existingImages.restaurant_adhar_front_image && (
                            <div>
                                <img
                                    src={formData.existingImages.restaurant_adhar_front_image}
                                    alt="Adhar Front Image"
                                    style={{ maxWidth: '200px', marginTop: '10px' }}
                                />
                                <p>Existing Aadhar Front Image</p>
                            </div>
                        )}
                    </CCol>

                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="restaurant_adhar_back_image">Aadhaar Back Image</CFormLabel>
                        <CFormInput
                            type="file"
                            id="restaurant_adhar_back_image"
                            name="restaurant_adhar_back_image"
                            onChange={handleFileChange}
                        />
                        {formData.existingImages.restaurant_adhar_back_image && (
                            <div>
                                <img
                                    src={formData.existingImages.restaurant_adhar_back_image}
                                    alt="Adhar Back Image"
                                    style={{ maxWidth: '200px', marginTop: '10px' }}
                                />
                                <p>Existing Aadhar Back Image</p>
                            </div>
                        )}
                    </CCol>

                    <CCol md={12} className="mt-4">
                        <CButton color="primary" type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Update Restaurant'}
                        </CButton>
                    </CCol>
                </>
            }
        />
    );
};

export default EditTiffinVendor;
