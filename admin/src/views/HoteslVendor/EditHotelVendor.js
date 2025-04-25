import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCol, CFormInput, CFormLabel, CButton, CFormCheck } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const EditHotelVendor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        hotel_name: '',
        hotel_phone: '',
        hotel_zone: '',
        hotel_address: '',
        hotel_owner: '',
        amenities: {
            AC: false,
            freeWifi: false,
            kitchen: false,
            TV: false,
            powerBackup: false,
            geyser: false,
            parkingFacility: false,
            elevator: false,
            cctvCameras: false,
            diningArea: false,
            privateEntrance: false,
            
            reception: false,
            caretaker: false,
            security: false,
            checkIn24_7: false,
            dailyHousekeeping: false,
            fireExtinguisher: false,
            firstAidKit: false,
            buzzerDoorBell: false,
            attachedBathroom: false,
        },
        existingImages: {
            aadhar_front: '',
            aadhar_back: '',
            panCard: '',
            gst: '',
            addressProof: '',
            ProfilePic: ''
        },
        files: {
            aadhar_front: null,
            aadhar_back: null,
            panCard: null,
            gst: null,
            addressProof: null,
            ProfilePic: null
        }
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    // Handle checkbox change (for amenities)
    const handleAmenityChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            amenities: {
                ...prevFormData.amenities,
                [name]: checked
            }
        }));
    };

    // Handle file change
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            files: {
                ...prevFormData.files,
                [name]: files[0] // update the file input with the new file
            }
        }));
    };
    

    // Fetch existing hotel data
    const handleFetchHotel = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://www.appapi.olyox.com/api/v1/hotels/get_hotelbyId/${id}`);
            setFormData({
                hotel_name: data.data.hotel_name,
                hotel_phone: data.data.hotel_phone,
                hotel_zone: data.data.hotel_zone,
                // hotel_address: data.data.hotel_address,
                hotel_owner: data.data.hotel_owner,
                amenities: data.data.amenities,
                existingImages: {
                    aadhar_front: data.data.Documents.find(doc => doc.d_type === 'aadhar_front')?.d_url || '',
                    aadhar_back: data.data.Documents.find(doc => doc.d_type === 'aadhar_back')?.d_url || '',
                    panCard: data.data.Documents.find(doc => doc.d_type === 'panCard')?.d_url || '',
                    gst: data.data.Documents.find(doc => doc.d_type === 'gst')?.d_url || '',
                    addressProof: data.data.Documents.find(doc => doc.d_type === 'addressProof')?.d_url || '',
                    ProfilePic: data.data.Documents.find(doc => doc.d_type === 'ProfilePic')?.d_url || ''
                }
            });
        } catch (error) {
            console.error('Error fetching hotel data:', error);
            toast.error(error?.response?.data?.message || 'Failed to fetch the hotel data.');
        } finally {
            setLoading(false);
        }
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { hotel_name, hotel_phone, hotel_zone, hotel_address, hotel_owner, amenities, area, hotel_geo_location, files, existingImages } = formData;
    
        // Validate required fields
        if (!hotel_name || !hotel_phone || !hotel_zone) {
            toast.error('All required fields must be filled.');
            return;
        }
    
        const formDataToSend = new FormData();
        formDataToSend.append('hotel_name', hotel_name);
        formDataToSend.append('hotel_phone', hotel_phone);
        formDataToSend.append('hotel_zone', hotel_zone);
        formDataToSend.append('hotel_owner', hotel_owner);
        formDataToSend.append('amenities', JSON.stringify(amenities)); // Send amenities as a JSON string
        formDataToSend.append('area', area);
        formDataToSend.append('hotel_geo_location', hotel_geo_location);
    
        // Append files conditionally
        const documentFields = ['aadhar_front', 'aadhar_back', 'panCard', 'gst', 'addressProof', 'ProfilePic'];
        documentFields.forEach((field) => {
            // Append the new file if present
            if (files && files[field]) {
                formDataToSend.append(field, files[field]);
            } else if (existingImages && existingImages[field]) {
                // If no new file is selected, append the URL
                formDataToSend.append(field, existingImages[field]);
            }
        });
    
        setLoading(true);
        try {
            const res = await axios.put(
                `http://www.appapi.olyox.com/api/v1/hotels/update_hotel_detail/${id}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            
            toast.success(res.data.message);
            // navigate('/hotel/all-hotel-vendors');
        } catch (error) {
            console.log('Error updating hotel details:', error);
            toast.error(error?.response?.data?.message || 'Failed to update the hotel details.');
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        handleFetchHotel();
    }, []); // Fetch hotel data only once when the component mounts

    return (
        <Form
            heading="Edit Hotel"
            btnText="Back"
            btnURL="/hotel/all-hotel-vendors"
            onSubmit={handleSubmit}
            formContent={
                <>
                    <CCol md={12}>
                        <CFormLabel htmlFor="hotel_name">Hotel Name</CFormLabel>
                        <CFormInput
                            id="hotel_name"
                            name="hotel_name"
                            placeholder="Enter hotel name"
                            value={formData.hotel_name}
                            onChange={handleChange}
                        />
                    </CCol>
                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="hotel_phone">Phone</CFormLabel>
                        <CFormInput
                            id="hotel_phone"
                            name="hotel_phone"
                            placeholder="Enter phone number"
                            value={formData.hotel_phone}
                            onChange={handleChange}
                        />
                    </CCol>
                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="hotel_zone">Zone</CFormLabel>
                        <CFormInput
                            id="hotel_zone"
                            name="hotel_zone"
                            placeholder="Enter hotel zone"
                            value={formData.hotel_zone}
                            onChange={handleChange}
                        />
                    </CCol>
                    {/* <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="hotel_address">Address</CFormLabel>
                        <CFormInput
                            id="hotel_address"
                            name="hotel_address"
                            placeholder="Enter hotel address"
                            value={formData.hotel_address}
                            onChange={handleChange}
                        />
                    </CCol> */}
                    <CCol md={12} className="mt-3">
                        <CFormLabel htmlFor="hotel_owner">Hotel Owner</CFormLabel>
                        <CFormInput
                            id="hotel_owner"
                            name="hotel_owner"
                            placeholder="Enter hotel owner"
                            value={formData.hotel_owner}
                            onChange={handleChange}
                        />
                    </CCol>

                    {/* Amenities checkboxes */}
                    {Object.keys(formData.amenities).map((key) => (
                        <CCol md={12} className="mt-3" key={key}>
                            <CFormCheck
                                id={key}
                                name={key}
                                label={key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                                checked={formData.amenities[key]}
                                onChange={handleAmenityChange}
                            />
                        </CCol>
                    ))}

                    {/* File inputs */}
                    {['aadhar_front', 'aadhar_back', 'panCard', 'gst', 'addressProof', 'ProfilePic'].map((field) => (
                        <CCol md={12} className="mt-3" key={field}>
                            <CFormLabel htmlFor={field}>{field.replace(/_/g, ' ').toUpperCase()}</CFormLabel>
                            <CFormInput
                                type="file"
                                id={field}
                                name={field}
                                onChange={handleFileChange}
                            />
                            {formData.existingImages[field] && (
                                <div>
                                    <img
                                        src={formData.existingImages[field]}
                                        alt={`${field} Image`}
                                        style={{ maxWidth: '200px', marginTop: '10px' }}
                                    />
                                    <p>Existing {field.replace(/_/g, ' ')}</p>
                                </div>
                            )}
                        </CCol>
                    ))}

                    <CCol md={12} className="mt-4">
                        <CButton color="primary" type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Update Hotel'}
                        </CButton>
                    </CCol>
                </>
            }
        />
    );
};

export default EditHotelVendor;
