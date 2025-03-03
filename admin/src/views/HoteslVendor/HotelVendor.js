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
    CListGroup,
    CListGroupItem
} from '@coreui/react';
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaUser, FaStar, FaIdCard, FaFileAlt, FaCheckCircle, FaTimesCircle, FaGlobe } from 'react-icons/fa';
import toast from 'react-hot-toast';

const HotelVendor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const fetchHotelDetails = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`http://localhost:3100/api/v1/hotels/get_hotelbyId/${id}`);
            setHotel(data.data);
        } catch (error) {
            console.error('Error fetching hotel details:', error);
            toast.error('Failed to load hotel details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotelDetails();
    }, [id]);

    const handleStatusToggle = async (id,status) => {
        const updateStatus = !status
        try {
            const res = await axios.put(`http://localhost:3100/api/v1/hotels/update_hotel_block_status/${id}`,{
                isBlockByAdmin:updateStatus
            });
            toast.success('Hotel status updated successfully.');
            fetchHotelDetails();
        } catch (error) {
            console.log("Internal server error", error);
            toast.error('Failed to update hotel status.');
        }
    };

    const handleDocumentVerifiedToggle = async (id,DocumentUploadedVerified) => {
        const updateStatus = !DocumentUploadedVerified
        try {
            const res = await axios.put(`http://localhost:3100/api/v1/hotels/verify_hotel_documents/${id}`,{
                DocumentUploadedVerified:updateStatus
            });
            toast.success('Hotel status updated successfully.');
            fetchHotelDetails();
        } catch (error) {
            console.log("Internal server error", error);
            toast.error('Failed to update hotel status.');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
                <CSpinner color="primary" />
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="text-center my-5">
                <h3>Hotel not found</h3>
                <CButton color="primary" className="mt-3" onClick={() => navigate('/hotel/all-hotel-vendor')}>
                    Back to Hotels List
                </CButton>
            </div>
        );
    }

    return (
        <div className="hotel-detail-page">
            <CButton 
                color="primary" 
                variant="outline" 
                className="mb-4"
                onClick={() => navigate('/hotel/all-hotel-vendor')}
            >
                <FaArrowLeft className="me-2" /> Back to Hotels List
            </CButton>

            <CRow>
                <CCol md={12}>
                    <CCard className="mb-4 border-0 shadow-sm">
                        <CCardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
                            <div>
                                <h3 className="mb-0">{hotel.hotel_name}</h3>
                                <div className="small">ID: {hotel.bh}</div>
                            </div>
                            <CBadge color={hotel.isBlockByAdmin ? 'danger' : 'success'} shape="rounded-pill" size="lg">
                                {hotel.isBlockByAdmin ? 'Blocked' : 'Active'}
                            </CBadge>
                        </CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol md={3} className="mb-4">
                                    <div className="text-center">
                                        {hotel.hotel_main_show_image ? (
                                            <CCardImage 
                                                src={hotel.hotel_main_show_image} 
                                                className="img-fluid rounded mb-3" 
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div 
                                                className="bg-light d-flex align-items-center justify-content-center rounded mx-auto mb-3"
                                                style={{ width: '200px', height: '200px' }}
                                            >
                                                <span className="text-muted h1">{hotel.hotel_name.charAt(0)}</span>
                                            </div>
                                        )}
                                        {hotel.isVerifiedTag && (
                                            <CBadge color="success" shape="rounded-pill">
                                                Verified
                                            </CBadge>
                                        )}
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
                                                        {hotel.hotel_address}
                                                    </div>
                                                </div>
                                            </div>
                                        </CCol>
                                        <CCol md={6} className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <FaPhone className="text-primary me-2" />
                                                <div>
                                                    <div className="text-muted small">Phone</div>
                                                    <div>{hotel.hotel_phone}</div>
                                                </div>
                                            </div>
                                        </CCol>
                                        <CCol md={6} className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <FaUser className="text-primary me-2" />
                                                <div>
                                                    <div className="text-muted small">Owner</div>
                                                    <div>{hotel.hotel_owner}</div>
                                                </div>
                                            </div>
                                        </CCol>
                                        <CCol md={6} className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <FaMapMarkerAlt className="text-primary me-2" />
                                                <div>
                                                    <div className="text-muted small">Zone</div>
                                                    <div>{hotel.hotel_zone}</div>
                                                </div>
                                            </div>
                                        </CCol>
                                        <CCol md={6} className="mb-3">
                                            <div className="d-flex align-items-center">
                                                <FaGlobe className="text-primary me-2" />
                                                <div>
                                                    <div className="text-muted small">Area</div>
                                                    <div>{hotel.area}</div>
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
                            <h4 className="mb-0">Verification Status</h4>
                        </CCardHeader>
                        <CCardBody>
                            <CListGroup flush>
                                <CListGroupItem>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Contact Number Verified:</span>
                                        {hotel.contactNumberVerify ? (
                                            <FaCheckCircle className="text-success" />
                                        ) : (
                                            <FaTimesCircle className="text-danger" />
                                        )}
                                    </div>
                                </CListGroupItem>
                                <CListGroupItem>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Verified Tag:</span>
                                        {hotel.isVerifiedTag ? (
                                            <FaCheckCircle className="text-success" />
                                        ) : (
                                            <FaTimesCircle className="text-danger" />
                                        )}
                                    </div>
                                </CListGroupItem>
                                <CListGroupItem>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Documents Uploaded:</span>
                                        {hotel.DocumentUploaded ? (
                                            <FaCheckCircle className="text-success" />
                                        ) : (
                                            <FaTimesCircle className="text-danger" />
                                        )}
                                    </div>
                                </CListGroupItem>
                                <CListGroupItem>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Documents Verified:</span>
                                        {hotel.DocumentUploadedVerified ? (
                                            <FaCheckCircle className="text-success" />
                                        ) : (
                                            <FaTimesCircle className="text-danger" />
                                        )}
                                    </div>
                                </CListGroupItem>
                                <CListGroupItem>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>All Checkouts Cleared:</span>
                                        {hotel.ClearAllCheckOut ? (
                                            <FaCheckCircle className="text-success" />
                                        ) : (
                                            <FaTimesCircle className="text-danger" />
                                        )}
                                    </div>
                                </CListGroupItem>
                                <CListGroupItem>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>Online Status:</span>
                                        {hotel.isOnline ? (
                                            <CBadge color="success">Online</CBadge>
                                        ) : (
                                            <CBadge color="secondary">Offline</CBadge>
                                        )}
                                    </div>
                                </CListGroupItem>
                            </CListGroup>
                        </CCardBody>
                    </CCard>
                </CCol>

                <CCol md={6}>
                        {/* <CCard className="mb-4 border-0 shadow-sm">
                            <CCardHeader className="bg-light">
                                <h4 className="mb-0">OTP Information</h4>
                            </CCardHeader>
                            <CCardBody>
                                <CListGroup flush>
                                    <CListGroupItem>
                                        <div className="d-flex justify-content-between">
                                            <span>Current OTP:</span>
                                            <span className="fw-bold">{hotel.otp || 'N/A'}</span>
                                        </div>
                                    </CListGroupItem>
                                    {hotel.otp_expires && (
                                        <CListGroupItem>
                                            <div className="d-flex justify-content-between">
                                                <span>OTP Expires:</span>
                                                <span>{new Date(hotel.otp_expires).toLocaleString()}</span>
                                            </div>
                                        </CListGroupItem>
                                    )}
                                </CListGroup>
                            </CCardBody>
                        </CCard> */}

                    <CCard className="mb-4 border-0 shadow-sm">
                        <CCardHeader className="bg-light">
                            <h4 className="mb-0">Location Information</h4>
                        </CCardHeader>
                        <CCardBody>
                            {hotel.hotel_geo_location && hotel.hotel_geo_location.coordinates && (
                                <CRow>
                                    <CCol md={6}>
                                        <div className="mb-3">
                                            <div className="text-muted small">Coordinates</div>
                                            <div>
                                                Latitude: {hotel.hotel_geo_location.coordinates[1]}<br />
                                                Longitude: {hotel.hotel_geo_location.coordinates[0]}
                                            </div>
                                        </div>
                                    </CCol>
                                    <CCol md={6}>
                                        <div className="mb-3">
                                            <div className="text-muted small">Map View</div>
                                            <CButton 
                                                color="primary" 
                                                size="sm"
                                                href={`https://www.google.com/maps?q=${hotel.hotel_geo_location.coordinates[1]},${hotel.hotel_geo_location.coordinates[0]}`}
                                                target="_blank"
                                            >
                                                <FaMapMarkerAlt className="me-2" />
                                                View on Google Maps
                                            </CButton>
                                        </div>
                                    </CCol>
                                </CRow>
                            )}
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
                                {hotel.Documents && hotel.Documents.map((doc, index) => (
                                    <CCol md={4} className="mb-4" key={index}>
                                        <CCard>
                                            <CCardImage 
                                                src={doc.d_url} 
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <CCardBody>
                                                <CCardTitle>
                                                    {doc.d_type === 'aadhar_front' && 'Aadhaar Front'}
                                                    {doc.d_type === 'aadhar_Back' && 'Aadhaar Back'}
                                                    {doc.d_type === 'panCard' && 'PAN Card'}
                                                    {doc.d_type === 'gst' && 'GST Certificate'}
                                                    {doc.d_type === 'addressProof' && 'Address Proof'}
                                                    {doc.d_type === 'ProfilePic' && 'Profile Picture'}
                                                </CCardTitle>
                                                <CButton 
                                                    color="primary" 
                                                    size="sm" 
                                                    href={doc.d_url} 
                                                    target="_blank"
                                                >
                                                    View Full Size
                                                </CButton>
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                ))}
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {hotel.amenities && Object.keys(hotel.amenities).length > 0 && (
                <CRow>
                    <CCol md={12}>
                        <CCard className="mb-4 border-0 shadow-sm">
                            <CCardHeader className="bg-light">
                                <h4 className="mb-0">Amenities</h4>
                            </CCardHeader>
                            <CCardBody>
                                <CRow>
                                    {Object.entries(hotel.amenities).map(([key, value], index) => (
                                        <CCol md={3} key={index}>
                                            <div className="d-flex align-items-center mb-3">
                                                {value ? (
                                                    <FaCheckCircle className="text-success me-2" />
                                                ) : (
                                                    <FaTimesCircle className="text-danger me-2" />
                                                )}
                                                <span>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                            </div>
                                        </CCol>
                                    ))}
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            )}

            <div className="d-flex justify-content-end mb-4">
                <CButton 
                    color="primary" 
                    className="me-2"
                    onClick={() => navigate(`/hotel/edit-hotel-vendor/${hotel._id}`)}
                >
                    Edit Hotel
                </CButton>
                <CButton 
                    color={hotel.isBlockByAdmin ? 'danger' : 'success'}
                    onClick={() => handleStatusToggle(hotel._id,hotel.isBlockByAdmin)}
                    className='me-2'
                >
                    {hotel.isBlockByAdmin ? 'Block Hotel' : 'Unblock Hotel'}
                </CButton>
                <CButton 
                    color={hotel.DocumentUploadedVerified ? 'success' : 'danger'}
                    onClick={() => handleDocumentVerifiedToggle(hotel._id,hotel.DocumentUploadedVerified)}
                >
                    {hotel.DocumentUploadedVerified ? 'Document Verified' : 'Document Unverified'}
                </CButton>
            </div>
        </div>
    );
};

export default HotelVendor;