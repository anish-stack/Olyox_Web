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
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaUser, FaClock, FaCheckCircle, FaTimesCircle, FaGlobe, FaEnvelope, FaTruck } from 'react-icons/fa';
import toast from 'react-hot-toast';

const HeavyTransportVendorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchVendorDetails = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(`http://localhost:3100/api/v1/heavy/heavy-vehicle-profile/${id}`);
      // console.log("data.data",data.data)
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

  const handleDocumentVerifiedToggle = async (id, isAlldocumentsVerified) => {
    const updateStatus = !isAlldocumentsVerified;
    try {
      const res = await axios.put(`http://localhost:3100/api/v1/heavy/update_hv_vendor_document_verify/${id}`, {
        isAlldocumentsVerified: updateStatus
      });
      toast.success('Vendor documents verification status updated successfully.');
      fetchVendorDetails();
    } catch (error) {
      console.log("Internal server error", error);
      toast.error('Failed to update vendor status.');
    }
  };

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
        <CButton color="primary" className="mt-3" onClick={() => navigate('/heavy/all-heavy-transport-vendor')}>
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
        onClick={() => navigate('/heavy/all-heavy-transport-vendor')}
      >
        <FaArrowLeft className="me-2" /> Back to Vendors List
      </CButton>

      <CRow>
        <CCol md={12}>
          <CCard className="mb-4 border-0 shadow-sm">
            <CCardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
              <div>
                <h3 className="mb-0">{vendor.name}</h3>
                <div className="small">ID: {vendor.Bh_Id}</div>
              </div>
              <CBadge color={vendor.is_blocked ? 'danger' : 'success'} shape="rounded-pill" size="lg">
                {vendor.is_blocked ? 'Blocked' : vendor.status}
              </CBadge>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={3} className="mb-4">
                  <div className="text-center">
                    {vendor.profile_image && vendor.profile_image.url ? (
                      <CCardImage
                        src={vendor.profile_image.url}
                        className="img-fluid rounded mb-3"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="bg-light d-flex align-items-center justify-content-center rounded mx-auto mb-3"
                        style={{ width: '200px', height: '200px' }}
                      >
                        <span className="text-muted h1">{vendor.name.charAt(0)}</span>
                      </div>
                    )}
                    <CBadge color={vendor.is_working ? 'success' : 'secondary'} shape="rounded-pill">
                      {vendor.is_working ? 'Working' : 'Not Working'}
                    </CBadge>
                  </div>
                </CCol>
                <CCol md={9}>
                  <CRow>
                    <CCol md={6} className="mb-3">
                      <div className="d-flex align-items-center">
                        <FaUser className="text-primary me-2" />
                        <div>
                          <div className="text-muted small">Name</div>
                          <div>{vendor.name}</div>
                        </div>
                      </div>
                    </CCol>
                    <CCol md={6} className="mb-3">
                      <div className="d-flex align-items-center">
                        <FaPhone className="text-primary me-2" />
                        <div>
                          <div className="text-muted small">Phone</div>
                          <div>{vendor.phone_number}</div>
                        </div>
                      </div>
                    </CCol>
                    <CCol md={6} className="mb-3">
                      <div className="d-flex align-items-center">
                        <FaEnvelope className="text-primary me-2" />
                        <div>
                          <div className="text-muted small">Email</div>
                          <div>{vendor.email}</div>
                        </div>
                      </div>
                    </CCol>
                    <CCol md={6} className="mb-3">
                      <div className="d-flex align-items-center">
                        <FaClock className="text-primary me-2" />
                        <div>
                          <div className="text-muted small">Call Timing</div>
                          <div>
                            {vendor.call_timing ?
                              `${vendor.call_timing.start_time} - ${vendor.call_timing.end_time}` :
                              'Not specified'}
                          </div>
                        </div>
                      </div>
                    </CCol>
                    <CCol md={6} className="mb-3">
                      <div className="d-flex align-items-center">
                        <FaTruck className="text-primary me-2" />
                        <div>
                          <div className="text-muted small">Profile Position</div>
                          <div>{vendor.profile_shows_at_position || 'Not assigned'}</div>
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
                    <span>Status:</span>
                    <CBadge color={getStatusColor(vendor.status)}>
                      {vendor.status}
                    </CBadge>
                  </div>
                </CListGroupItem>
                <CListGroupItem>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Documents Verified:</span>
                    {vendor.isAlldocumentsVerified ? (
                      <FaCheckCircle className="text-success" />
                    ) : (
                      <FaTimesCircle className="text-danger" />
                    )}
                  </div>
                </CListGroupItem>
                <CListGroupItem>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Is Blocked:</span>
                    {vendor.is_blocked ? (
                      <FaCheckCircle className="text-danger" />
                    ) : (
                      <FaTimesCircle className="text-success" />
                    )}
                  </div>
                </CListGroupItem>
                <CListGroupItem>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Is Working:</span>
                    {vendor.is_working ? (
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
          <CCard className="mb-4 border-0 shadow-sm">
            <CCardHeader className="bg-light">
              <h4 className="mb-0">Service Areas</h4>
            </CCardHeader>
            <CCardBody>
              {vendor.service_areas && vendor.service_areas.length > 0 ? (
                <CListGroup flush>
                  {vendor.service_areas.map((area, index) => (
                    <CListGroupItem key={index}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{area.name}</strong>
                          <div className="small text-muted">
                            Lat: {area.location.coordinates[1]}, Long: {area.location.coordinates[0]}
                          </div>
                        </div>
                        <CButton
                          color="primary"
                          size="sm"
                          href={`https://www.google.com/maps?q=${area.location.coordinates[1]},${area.location.coordinates[0]}`}
                          target="_blank"
                        >
                          <FaMapMarkerAlt className="me-2" />
                          View Map
                        </CButton>
                      </div>
                    </CListGroupItem>
                  ))}
                </CListGroup>
              ) : (
                <div className="text-center text-muted">No service areas defined</div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={12}>
          <CCard className="mb-4 border-0 shadow-sm">
            <CCardHeader className="bg-light">
              <h4 className="mb-0">Vehicles</h4>
            </CCardHeader>
            <CCardBody>
              {vendor.vehicle_info && vendor.vehicle_info.length > 0 ? (
                <CRow>
                  {vendor.vehicle_info.map((vehicle, index) => (
                    <CCol md={4} className="mb-4" key={index}>
                      <CCard>
                        <CCardBody>
                          <CCardTitle>Vehicle #{index + 1}</CCardTitle>
                          {/* Check if vehicle is an object or just an ID */}
                          {typeof vehicle === 'object' && vehicle !== null ? (
                            <div>
                              <div><strong>Name:</strong> {vehicle.name || 'N/A'}</div>
                              <div><strong>Type:</strong> {vehicle.vehicleType || 'N/A'}</div>
                              <div><strong>Status:</strong> {vehicle.isAvailable ?
                                <CBadge color="success">Available</CBadge> :
                                <CBadge color="warning">Unavailable</CBadge>}
                              </div>
                              <div className="mt-1"><strong>ID:</strong> <span className="text-muted">{vehicle._id}</span></div>
                            </div>
                          ) : (
                            <div className="text-muted">ID: {vehicle}</div>
                          )}
                          {/* <CButton
                            color="primary"
                            size="sm"
                            className="mt-3"
                            onClick={() => navigate(`/heavy-transport/vehicle/${typeof vehicle === 'object' ? vehicle._id : vehicle}`)}
                          >
                            View Details
                          </CButton> */}
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))}
                </CRow>
              ) : (
                <div className="text-center text-muted">No vehicles associated</div>
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
              {vendor.documents && vendor.documents.length > 0 ? (
                <CRow>
                  {vendor.documents.map((doc, index) => (
                    <CCol md={4} className="mb-4" key={index}>
                      <CCard>
                        <CCardBody>
                          <CCardTitle>Document #{index + 1}</CCardTitle>
                          {/* Handle both object and string ID cases */}
                          {typeof doc === 'object' && doc !== null ? (
                            <div>
                              <div className="text-muted">Type: {doc.documentType || 'Unknown'}</div>
                              <div className="text-muted">ID: {doc._id}</div>
                              {doc.documentFile && (
                                <CButton
                                  color="primary"
                                  size="sm"
                                  className="mt-3"
                                  href={doc.documentFile}
                                  target="_blank"
                                >
                                  View Document
                                </CButton>
                              )}
                            </div>
                          ) : (
                            <div>
                              <div className="text-muted">ID: {doc}</div>
                              <CButton
                                color="primary"
                                size="sm"
                                className="mt-3"
                                onClick={() => navigate(`/heavy-transport/document/${doc}`)}
                              >
                                View Document
                              </CButton>
                            </div>
                          )}
                        </CCardBody>
                      </CCard>
                    </CCol>
                  ))}
                </CRow>
              ) : (
                <div className="text-center text-muted">No documents uploaded</div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <div className="d-flex justify-content-end mb-4">
        <CButton
          color="primary"
          className="me-2"
          onClick={() => navigate(`/heavy/edit-heavy-transport-vendor/${vendor._id}`)}
        >
          Edit Vendor
        </CButton>
        <CButton
          style={{ color: 'white' }}
          color={vendor.isAlldocumentsVerified ? 'success' : 'danger'}
          onClick={() => handleDocumentVerifiedToggle(vendor._id, vendor.isAlldocumentsVerified)}
        >
          {vendor.isAlldocumentsVerified ? 'Documents Verified' : 'Documents Unverified'}
        </CButton>
      </div>
    </div>
  );
};

// Helper function for status badge colors
const getStatusColor = (status) => {
  switch (status) {
    case 'Active':
      return 'success';
    case 'Inactive':
      return 'warning';
    case 'Suspended':
      return 'danger';
    default:
      return 'secondary';
  }
};

export default HeavyTransportVendorDetail;