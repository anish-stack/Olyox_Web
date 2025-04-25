import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CSpinner,
    CButton,
    CBadge,
    CCardImage,
    CCardTitle,
    CCardText,
    CListGroup,
    CListGroupItem
} from '@coreui/react';
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaClock, FaStar, FaMoneyBillWave, FaIdCard, FaFileAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const TiffinVendorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    
    
    const fetchVendorDetails = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://www.appapi.olyox.com/api/v1/tiffin/get_single_restaurant/${id}`);
            setVendor(data.data);
        } catch (error) {
            console.error('Error fetching vendor details:', error);
            toast.error('Failed to load vendor details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchVendorDetails();
    }, [id]);

    const handleStatusToggle = async (id,status) => {
        const updateStatus = !status
        try {
            const res = await axios.put(`http://www.appapi.olyox.com/api/v1/tiffin/update_restaurant_status/${id}`,{
                status: updateStatus
            })
            toast.success('Vendor status updated successfully.');
            fetchVendorDetails();
        } catch (error) {
            console.log("Internal server error",error)
        }
    }

    const handleDocumentVerifyToggle = async (id,status) => {
        const updateStatus = !status
        try {
            const res = await axios.put(`http://www.appapi.olyox.com/api/v1/tiffin/verify_tiffin_document/${id}`,{
                documentVerify: updateStatus
            })
            toast.success('Vendor status updated successfully.');
            fetchVendorDetails();
        } catch (error) {
            console.log("Internal server error",error)
        }
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
                <CSpinner color="primary" />
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="text-center my-5">
                <h3>Vendor not found</h3>
                <CButton color="primary" className="mt-3" onClick={() => navigate('/tiffin/all-tiffin-vendor')}>
                    Back to Vendors List
                </CButton>
            </div>
        );
    }

    return (
        <div className="vendor-detail-page">
            <CButton 
                color="primary" 
                variant="outline" 
                className="mb-4"
                onClick={() => navigate('/tiffin/all-tiffin-vendor')}
            >
                <FaArrowLeft className="me-2" /> Back to Vendors List
            </CButton>

            <CRow>
                <CCol md={12}>
                    <CCard className="mb-4 border-0 shadow-sm">
                        <CCardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
                            <div>
                                <h3 className="mb-0">{vendor.restaurant_name}</h3>
                                <div className="small">ID: {vendor.restaurant_BHID}</div>
                            </div>
                            <CBadge color={vendor.status ? 'success' : 'danger'} shape="rounded-pill" size="lg">
                                {vendor.status ? 'Active' : 'Inactive'}
                            </CBadge>
                        </CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol md={3} className="mb-4">
                                    <div className="text-center">
                                        {vendor.logo && vendor.logo.url ? (
                                            <CCardImage 
                                                src={vendor.logo.url} 
                                                className="img-fluid rounded-circle mb-3" 
                                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div 
                                                className="bg-light d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
                                                style={{ width: '150px', height: '150px' }}
                                            >
                                                <span className="text-muted h1">{vendor.restaurant_name.charAt(0)}</span>
                                            </div>
                                        )}
                                        <CBadge 
                                            color={vendor.restaurant_category === 'Veg' ? 'success' : 'danger'} 
                                            shape="rounded-pill"
                                        >
                                            {vendor.restaurant_category}
                                        </CBadge>
                                    </div>
                                </CCol>
                                <CCol md={9}>
                                    <CRow>
                                        <CCol md={6} className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <FaMapMarkerAlt className="text-primary me-2" />
                                                <div>
                                                    <div className="text-muted small">Address</div>
                                                    <div>
                                                        {vendor.restaurant_address.street}, {vendor.restaurant_address.city}, {vendor.restaurant_address.state} - {vendor.restaurant_address.zip}
                                                    </div>
                                                </div>
                                            </div>
                                        </CCol>
                                        <CCol md={6} className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <FaPhone className="text-primary me-2" />
                                                <div>
                                                    <div className="text-muted small">Phone</div>
                                                    <div>{vendor.restaurant_phone}</div>
                                                </div>
                                            </div>
                                        </CCol>
                                        <CCol md={6} className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <FaClock className="text-primary me-2" />
                                                <div>
                                                    <div className="text-muted small">Opening Hours</div>
                                                    <div>{vendor.openingHours}</div>
                                                </div>
                                            </div>
                                        </CCol>
                                        <CCol md={6} className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <FaStar className="text-warning me-2" />
                                                <div>
                                                    <div className="text-muted small">Rating</div>
                                                    <div>{vendor.rating} / 5</div>
                                                </div>
                                            </div>
                                        </CCol>
                                        <CCol md={6} className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <FaMoneyBillWave className="text-success me-2" />
                                                <div>
                                                    <div className="text-muted small">Price Range</div>
                                                    <div>₹{vendor.minPrice} - ₹{vendor.priceForTwoPerson}</div>
                                                </div>
                                            </div>
                                        </CCol>
                                        <CCol md={6} className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <FaIdCard className="text-primary me-2" />
                                                <div>
                                                    <div className="text-muted small">FSSAI Number</div>
                                                    <div>{vendor.restaurant_fssai}</div>
                                                </div>
                                            </div>
                                        </CCol>
                                    </CRow>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CRow>
                <CCol md={6}>
                    <CCard className="mb-4 border-0 shadow-sm">
                        <CCardHeader className="bg-light">
                            <h4 className="mb-0">Business Information</h4>
                        </CCardHeader>
                        <CCardBody>
                            <CListGroup flush>
                                <CListGroupItem>
                                    <div className="d-flex justify-content-between">
                                        <span>Delivery Time:</span>
                                        <span className="fw-bold">{vendor.minDeliveryTime}</span>
                                    </div>
                                </CListGroupItem>
                                <CListGroupItem>
                                    <div className="d-flex justify-content-between">
                                        <span>Top Listed:</span>
                                        <CBadge color={vendor.restaurant_in_top_list ? 'success' : 'secondary'}>
                                            {vendor.restaurant_in_top_list ? 'Yes' : 'No'}
                                        </CBadge>
                                    </div>
                                </CListGroupItem>
                                <CListGroupItem>
                                    <div className="d-flex justify-content-between">
                                        <span>Currently Working:</span>
                                        <CBadge color={vendor.isWorking ? 'success' : 'danger'}>
                                            {vendor.isWorking ? 'Yes' : 'No'}
                                        </CBadge>
                                    </div>
                                </CListGroupItem>
                                <CListGroupItem>
                                    <div className="d-flex justify-content-between">
                                        <span>Document Verified:</span>
                                        <CBadge color={vendor.documentVerify ? 'success' : 'warning'}>
                                            {vendor.documentVerify ? 'Verified' : 'Pending'}
                                        </CBadge>
                                    </div>
                                </CListGroupItem>
                                <CListGroupItem>
                                    <div className="d-flex justify-content-between">
                                        <span>OTP Verified:</span>
                                        <CBadge color={vendor.isOtpVerify ? 'success' : 'warning'}>
                                            {vendor.isOtpVerify ? 'Verified' : 'Pending'}
                                        </CBadge>
                                    </div>
                                </CListGroupItem>
                            </CListGroup>
                        </CCardBody>
                    </CCard>
                </CCol>

                <CCol md={6}>
                    <CCard className="mb-4 border-0 shadow-sm">
                        <CCardHeader className="bg-light">
                            <h4 className="mb-0">Financial Information</h4>
                        </CCardHeader>
                        <CCardBody>
                            <CListGroup flush>
                                <CListGroupItem>
                                    <div className="d-flex justify-content-between">
                                        <span>Wallet Balance:</span>
                                        <span className="fw-bold text-success">₹{vendor.wallet}</span>
                                    </div>
                                </CListGroupItem>
                                <CListGroupItem>
                                    <div className="d-flex justify-content-between">
                                        <span>Referral Earnings:</span>
                                        <span className="fw-bold">₹{vendor.referral_earning}</span>
                                    </div>
                                </CListGroupItem>
                                <CListGroupItem>
                                    <div className="d-flex justify-content-between">
                                        <span>Price for Two:</span>
                                        <span className="fw-bold">₹{vendor.priceForTwoPerson}</span>
                                    </div>
                                </CListGroupItem>
                                <CListGroupItem>
                                    <div className="d-flex justify-content-between">
                                        <span>Minimum Price:</span>
                                        <span className="fw-bold">₹{vendor.minPrice}</span>
                                    </div>
                                </CListGroupItem>
                                <CListGroupItem>
                                    <div className="d-flex justify-content-between">
                                        <span>Joined On:</span>
                                        <span>{new Date(vendor.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </CListGroupItem>
                            </CListGroup>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CRow>
                <CCol md={12}>
                    <CCard className="mb-4 border-0 shadow-sm">
                        <CCardHeader className="bg-light">
                            <h4 className="mb-0">Documents</h4>
                        </CCardHeader>
                        <CCardBody>
                            <CRow>
                                {vendor.restaurant_fssai_image && vendor.restaurant_fssai_image.url && (
                                    <CCol md={3} className="mb-4">
                                        <CCard>
                                            <CCardImage 
                                                src={vendor.restaurant_fssai_image.url} 
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <CCardBody>
                                                <CCardTitle>FSSAI Certificate</CCardTitle>
                                                <CButton 
                                                    color="primary" 
                                                    size="sm" 
                                                    href={vendor.restaurant_fssai_image.url} 
                                                    target="_blank"
                                                >
                                                    View Full Size
                                                </CButton>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                )}
                                
                                {vendor.restaurant_pan_image && vendor.restaurant_pan_image.url && (
                                    <CCol md={3} className="mb-4">
                                        <CCard>
                                            <CCardImage 
                                                src={vendor.restaurant_pan_image.url} 
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <CCardBody>
                                                <CCardTitle>PAN Card</CCardTitle>
                                                <CButton 
                                                    color="primary" 
                                                    size="sm" 
                                                    href={vendor.restaurant_pan_image.url} 
                                                    target="_blank"
                                                >
                                                    View Full Size
                                                </CButton>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                )}
                                
                                {vendor.restaurant_adhar_front_image && vendor.restaurant_adhar_front_image.url && (
                                    <CCol md={3} className="mb-4">
                                        <CCard>
                                            <CCardImage 
                                                src={vendor.restaurant_adhar_front_image.url} 
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <CCardBody>
                                                <CCardTitle>Aadhaar Front</CCardTitle>
                                                <CButton 
                                                    color="primary" 
                                                    size="sm" 
                                                    href={vendor.restaurant_adhar_front_image.url} 
                                                    target="_blank"
                                                >
                                                    View Full Size
                                                </CButton>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                )}
                                
                                {vendor.restaurant_adhar_back_image && vendor.restaurant_adhar_back_image.url && (
                                    <CCol md={3} className="mb-4">
                                        <CCard>
                                            <CCardImage 
                                                src={vendor.restaurant_adhar_back_image.url} 
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <CCardBody>
                                                <CCardTitle>Aadhaar Back</CCardTitle>
                                                <CButton 
                                                    color="primary" 
                                                    size="sm" 
                                                    href={vendor.restaurant_adhar_back_image.url} 
                                                    target="_blank"
                                                >
                                                    View Full Size
                                                </CButton>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                )}
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <CRow>
                <CCol md={12}>
                    <CCard className="mb-4 border-0 shadow-sm">
                        <CCardHeader className="bg-light">
                            <h4 className="mb-0">Location Information</h4>
                        </CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <div className="text-muted small">Coordinates</div>
                                        <div>
                                            Latitude: {vendor.geo_location.coordinates[1]}<br />
                                            Longitude: {vendor.geo_location.coordinates[0]}
                                        </div>
                                    </div>
                                </CCol>
                                <CCol md={6}>
                                    <div className="mb-3">
                                        <div className="text-muted small">Map View</div>
                                        <CButton 
                                            color="primary" 
                                            size="sm"
                                            href={`https://www.google.com/maps?q=${vendor.geo_location.coordinates[1]},${vendor.geo_location.coordinates[0]}`}
                                            target="_blank"
                                        >
                                            <FaMapMarkerAlt className="me-2" />
                                            View on Google Maps
                                        </CButton>
                                    </div>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            <div className="d-flex justify-content-end mb-4">
                <CButton 
                    color="primary" 
                    className="me-2"
                    onClick={() => navigate(`/tiffin/edit-tiffin-vendor/${vendor._id}`)}
                >
                    Edit Vendor
                </CButton>
                <CButton 
                    color={vendor.status ? 'danger' : 'success'}
                    onClick={() => handleStatusToggle(vendor._id, vendor.status)}
                    className='me-2'
                >
                    {vendor.status ? 'Deactivate' : 'Activate'} Vendor
                </CButton>
                <CButton 
                    color={vendor.documentVerify ? 'success' : 'danger'}
                    onClick={() => handleDocumentVerifyToggle(vendor._id, vendor.documentVerify)}
                >
                    {vendor.status ? 'Document Unverify' : 'Document Verified'}
                </CButton>
            </div>
        </div>
    );
};

export default TiffinVendorDetail;