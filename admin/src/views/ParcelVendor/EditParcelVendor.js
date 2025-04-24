import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCol, CFormInput, CFormLabel, CButton } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const EditParcelVendor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        type: '',
        bikeDetails: {
            make: '',
            model: '',
            year: '',
            licensePlate: ''
        },
        
        existingDocuments: {
            license: '',
            rc: '',
            pan: '',
            aadhar: ''
        },
        files: {
            license: null,
            rc: null,
            pan: null,
            aadhar: null
        }
    });

    useEffect(() => {
        const fetchParcelUser = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`https://demoapi.olyox.com/api/v1/parcel/get_single_parcel/${id}`);
                setFormData({
                    name: data.data.name,
                    phone: data.data.phone,
                    address: data.data.address,
                    type: data.data.type,
                    bikeDetails: data.data.bikeDetails || {},
                    existingDocuments: data.data.documents || {}
                });
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };
        fetchParcelUser();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBikeDetailsChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            bikeDetails: { ...prev.bikeDetails, [name]: value }
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            files: { ...prev.files, [name]: files[0] }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('type', formData.type);
    
        // Append bike details
        Object.entries(formData.bikeDetails).forEach(([key, value]) => {
            formDataToSend.append(`bikeDetails[${key}]`, value);
        });
    
        // Ensure files exist before iterating
        if (formData.files && Object.keys(formData.files).length > 0) {
            Object.keys(formData.files).forEach((key) => {
                if (formData.files[key]) {
                    formDataToSend.append(key, formData.files[key]);
                }
            });
        }
    
        setLoading(true);
        try {
            const res = await axios.put(
                `https://demoapi.olyox.com/api/v1/parcel/update_parcel_data/${id}`,
                formDataToSend,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            toast.success(res.data.message);
            // navigate('/parcel/all-parcel-vendors');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update details.');
            console.log("Internal server error", error);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Form
            heading="Edit Parcel Vendor"
            btnText="Back"
            btnURL="/parcel/all-parcel-vendors"
            onSubmit={handleSubmit}
            formContent={
                <>
                    <CCol md={6}>
                        <CFormLabel htmlFor="name">Name</CFormLabel>
                        <CFormInput id="name" name="name" value={formData.name} onChange={handleChange} />
                    </CCol>
                    <CCol md={6} className="mt-3">
                        <CFormLabel htmlFor="phone">Phone</CFormLabel>
                        <CFormInput id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                    </CCol>
                    <CCol md={6} className="mt-3">
                        <CFormLabel htmlFor="address">Address</CFormLabel>
                        <CFormInput id="address" name="address" value={formData.address} onChange={handleChange} />
                    </CCol>
                    {/* <CCol md={6} className="mt-3">
                        <CFormLabel htmlFor="type">Type</CFormLabel>
                        <CFormInput id="type" name="type" value={formData.type} onChange={handleChange} />
                    </CCol> */}
                    <CCol md={12} className="mt-3">
                        <CFormLabel>Bike Details</CFormLabel>

                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="type">Bike Name</CFormLabel>
                            <CFormInput id="make" name="make" placeholder="Make" value={formData.bikeDetails.make} onChange={handleBikeDetailsChange} />
                        </CCol>

                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="type">Model</CFormLabel>
                            <CFormInput id="model" name="model" placeholder="Model" value={formData.bikeDetails.model} onChange={handleBikeDetailsChange} />
                        </CCol>

                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="type">Year</CFormLabel>
                            <CFormInput id="year" name="year" placeholder="Year" value={formData.bikeDetails.year} onChange={handleBikeDetailsChange} />
                        </CCol>

                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="type">Number Plate</CFormLabel>
                            <CFormInput id="licensePlate" name="licensePlate" placeholder="License Plate" value={formData.bikeDetails.licensePlate} onChange={handleBikeDetailsChange} />
                        </CCol>
                    </CCol>

                    {/* Document Upload with Preview */}
                    <CCol md={12} className="mt-3">
                        <CFormLabel>Upload Documents</CFormLabel>
                        {[
                            { key: 'license', label: 'License' },
                            { key: 'rc', label: 'Registration Certificate (RC)' },
                            { key: 'pan', label: 'PAN Card' },
                            { key: 'aadhar', label: 'Aadhar Card' }
                        ].map(({ key, label }) => (
                            <div key={key} className="mb-3">
                                <CFormLabel>{label}</CFormLabel>
                                {formData.existingDocuments[key] && (
                                    <img
                                        src={formData.existingDocuments[key]}
                                        alt={`${label} preview`}
                                        style={{ width: '150px', height: 'auto', display: 'block', marginBottom: '10px', borderRadius: '5px' }}
                                    />
                                )}
                                <CFormInput type="file" id={key} name={key} onChange={handleFileChange} />
                            </div>
                        ))}
                    </CCol>


                    <CCol md={12} className="mt-4">
                        <CButton color="primary" type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Parcel Vendor'}
                        </CButton>
                    </CCol>
                </>
            }
        />
    );
};

export default EditParcelVendor;
