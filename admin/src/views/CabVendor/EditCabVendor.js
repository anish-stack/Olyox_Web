import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CCol, CFormInput, CFormLabel, CButton } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';

const EditCabVendor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        rideVehicleInfo: {
            vehicleName: '',
            vehicleType: '',
            PricePerKm: '',
            VehicleNumber: ''
        },
        
        existingDocuments: {
            license: '',
            rc: '',
            insurance: '',
            aadharBack: '',
            aadharFront: '',
            pancard: ''
        },
        files: {
            license: null,
            rc: null,
            insurance: null,
            aadharBack: null,
            aadharFront: null,
            pancard: null
        }
    });

    useEffect(() => {
        const fetchRiderDetails = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`http://www.appapi.olyox.com/api/v1/rider/get_single_rider/${id}`);
                setFormData({
                    name: data.data.name || '',
                    phone: data.data.phone || '',
                    rideVehicleInfo: data.data.rideVehicleInfo || {},
                    existingDocuments: data.data.documents || {}
                });
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Failed to fetch rider data.');
            } finally {
                setLoading(false);
            }
        };
        fetchRiderDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleVehicleInfoChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            rideVehicleInfo: { ...prev.rideVehicleInfo, [name]: value }
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

        // Append ride vehicle info
        Object.entries(formData.rideVehicleInfo).forEach(([key, value]) => {
            formDataToSend.append(`rideVehicleInfo[${key}]`, value);
        });

        // Append document files
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
                `http://www.appapi.olyox.com/api/v1/rider/update_rider_detail/${id}`,
                formDataToSend,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            toast.success(res.data.message);
            // navigate('/rider/all-riders');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update rider details.');
            console.log("Internal server error", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            heading="Edit Rider Details"
            btnText="Back"
            btnURL="/rider/all-riders"
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

                    {/* Ride Vehicle Info */}
                    <CCol md={12} className="mt-3">
                        <CFormLabel>Ride Vehicle Information</CFormLabel>

                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="vehicleName">Vehicle Name</CFormLabel>
                            <CFormInput id="vehicleName" name="vehicleName" placeholder="Vehicle Name" value={formData.rideVehicleInfo.vehicleName} onChange={handleVehicleInfoChange} />
                        </CCol>

                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="vehicleType">Vehicle Type</CFormLabel>
                            <CFormInput id="vehicleType" name="vehicleType" placeholder="Vehicle Type" value={formData.rideVehicleInfo.vehicleType} onChange={handleVehicleInfoChange} />
                        </CCol>

                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="PricePerKm">Price Per Km</CFormLabel>
                            <CFormInput id="PricePerKm" name="PricePerKm" placeholder="Price Per Km" value={formData.rideVehicleInfo.PricePerKm} onChange={handleVehicleInfoChange} />
                        </CCol>

                        <CCol md={12} className="mt-3">
                            <CFormLabel htmlFor="VehicleNumber">Vehicle Number</CFormLabel>
                            <CFormInput id="VehicleNumber" name="VehicleNumber" placeholder="Vehicle Number" value={formData.rideVehicleInfo.VehicleNumber} onChange={handleVehicleInfoChange} />
                        </CCol>
                    </CCol>

                    {/* Document Upload with Preview */}
                    <CCol md={12} className="mt-3">
                        <CFormLabel>Upload Documents</CFormLabel>
                        {[
                            { key: 'license', label: 'License' },
                            { key: 'rc', label: 'Registration Certificate (RC)' },
                            { key: 'insurance', label: 'Insurance' },
                            { key: 'aadharBack', label: 'Aadhar Card (Back)' },
                            { key: 'aadharFront', label: 'Aadhar Card (Front)' },
                            { key: 'pancard', label: 'PAN Card' }
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
                            {loading ? 'Updating...' : 'Update Rider Details'}
                        </CButton>
                    </CCol>
                </>
            }
        />
    );
};

export default EditCabVendor;
