import React, { useEffect, useState } from 'react';
import { Truck, MapPin, Phone, Star, FileText, CheckCircle, XCircle, ArrowLeft, CreditCard, Calendar, Award } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function CabDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Mock data for demonstration
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRider = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:3100/api/v1/rider/get_single_rider/${id}`)
      setRider(data.data);
      setLoading(false);
    } catch (error) {
      console.log("Internal server error", error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRider();
  }, []);

  const handleDocumentVerifyToggle = async (id, status) => {
    try {
      const updateStatus = !status
      const res = await axios.put(`http://localhost:3100/api/v1/rider/update_rider_document_verify/${id}`, {
        DocumentVerify: updateStatus
      })
      toast.success("DocumentVerify updated successfully");
      fetchRider();
    } catch (error) {
      console.log("Internal server error", error)
    }
  };

  const handleBackToList = () => {
    navigate('/cab/all-cab-vendor')
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!rider) {
    return (
      <div className="text-center my-5">
        <h3>Rider not found</h3>
        <button className="btn btn-primary mt-3" onClick={handleBackToList}>
          Back to Riders List
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <button
        className="btn btn-outline-primary mb-4"
        onClick={handleBackToList}
      >
        <ArrowLeft className="me-2" size={18} /> Back to Riders List
      </button>

      <div className="row">
        <div className="col-12">
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <div>
                <h3 className="mb-0">{rider.name}</h3>
                <div className="small">ID: {rider.BH}</div>
              </div>
              <span className={`badge ${rider.isActive ? 'bg-success' : 'bg-danger'} rounded-pill fs-6`}>
                {rider.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-4 text-center">
                  <div
                    className="bg-light d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
                    style={{ width: '150px', height: '150px' }}
                  >
                    <span className="text-muted h1">{rider.name.charAt(0)}</span>
                  </div>
                  <span className={`badge ${rider.isAvailable ? 'bg-success' : 'bg-secondary'} rounded-pill`}>
                    {rider.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="col-md-9">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <Phone className="text-primary me-2" size={18} />
                        <div>
                          <div className="text-muted small">Phone</div>
                          <div>{rider.phone}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <Truck className="text-primary me-2" size={18} />
                        <div>
                          <div className="text-muted small">Vehicle</div>
                          <div>{rider.rideVehicleInfo.vehicleName} ({rider.rideVehicleInfo.vehicleType})</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <Star className="text-warning me-2" size={18} />
                        <div>
                          <div className="text-muted small">Rating</div>
                          <div>{rider.Ratings} / 5</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <Award className="text-primary me-2" size={18} />
                        <div>
                          <div className="text-muted small">Total Rides</div>
                          <div>{rider.TotalRides}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <Calendar className="text-primary me-2" size={18} />
                        <div>
                          <div className="text-muted small">Joined On</div>
                          <div>{new Date(rider.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <CreditCard className="text-success me-2" size={18} />
                        <div>
                          <div className="text-muted small">Payment Status</div>
                          <div>{rider.isPaid ? 'Paid' : 'Unpaid'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-header bg-light">
              <h4 className="mb-0">Rider Information</h4>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <span>Vehicle Number:</span>
                    <span className="fw-bold">{rider.rideVehicleInfo.VehicleNumber}</span>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <span>Profile Complete:</span>
                    <span className={`badge ${rider.isProfileComplete ? 'bg-success' : 'bg-warning'}`}>
                      {rider.isProfileComplete ? 'Complete' : 'Incomplete'}
                    </span>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <span>Documents Uploaded:</span>
                    <span className={`badge ${rider.isDocumentUpload ? 'bg-success' : 'bg-warning'}`}>
                      {rider.isDocumentUpload ? 'Uploaded' : 'Pending'}
                    </span>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <span>Document Verified:</span>
                    <span className={`badge ${rider.DocumentVerify ? 'bg-success' : 'bg-warning'}`}>
                      {rider.DocumentVerify ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <span>OTP Verified:</span>
                    <span className={`badge ${rider.isOtpVerify ? 'bg-success' : 'bg-warning'}`}>
                      {rider.isOtpVerify ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-header bg-light">
              <h4 className="mb-0">Account Information</h4>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <span>Membership:</span>
                    <span className="fw-bold">{rider.isFreeMember ? 'Free' : 'Premium'}</span>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <span>Amount Paid:</span>
                    <span className="fw-bold">₹{rider.amountPaid}</span>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <span>OTP Block Status:</span>
                    <span className={`badge ${rider.isOtpBlock ? 'bg-danger' : 'bg-success'}`}>
                      {rider.isOtpBlock ? 'Blocked' : 'Not Blocked'}
                    </span>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <span>Admin Block Status:</span>
                    <span className={`badge ${rider.isBlockByAdmin ? 'bg-danger' : 'bg-success'}`}>
                      {rider.isBlockByAdmin ? 'Blocked' : 'Not Blocked'}
                    </span>
                  </div>
                </li>
                <li className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <span>Resend OTP Count:</span>
                    <span>{rider.howManyTimesHitResend}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-header bg-light">
              <h4 className="mb-0">Documents</h4>
            </div>
            <div className="card-body">
              <div className="row">
                {rider?.documents?.license && (
                  <div className="col-md-4 mb-4">
                    <div className="card">
                      <img
                        src={rider.documents.license}
                        className="card-img-top"
                        alt="License"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">Driving License</h5>
                        <a
                          href={rider.documents.license}
                          className="btn btn-primary btn-sm"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Full Size
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {rider?.documents?.rc && (
                  <div className="col-md-4 mb-4">
                    <div className="card">
                      <img
                        src={rider.documents.rc}
                        className="card-img-top"
                        alt="RC"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">Registration Certificate</h5>
                        <a
                          href={rider.documents.rc}
                          className="btn btn-primary btn-sm"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Full Size
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {rider?.documents?.insurance && (
                  <div className="col-md-4 mb-4">
                    <div className="card">
                      <img
                        src={rider.documents.insurance}
                        className="card-img-top"
                        alt="Insurance"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">Insurance</h5>
                        <a
                          href={rider.documents.insurance}
                          className="btn btn-primary btn-sm"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Full Size
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {rider?.documents?.aadharFront && (
                  <div className="col-md-4 mb-4">
                    <div className="card">
                      <img
                        src={rider.documents.aadharFront}
                        className="card-img-top"
                        alt="Aadhar Front"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">Aadhaar Front</h5>
                        <a
                          href={rider.documents.aadharFront}
                          className="btn btn-primary btn-sm"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Full Size
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {rider?.documents?.aadharBack && (
                  <div className="col-md-4 mb-4">
                    <div className="card">
                      <img
                        src={rider.documents.aadharBack}
                        className="card-img-top"
                        alt="Aadhar Back"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">Aadhaar Back</h5>
                        <a
                          href={rider.documents.aadharBack}
                          className="btn btn-primary btn-sm"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Full Size
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {rider?.documents?.pancard && (
                  <div className="col-md-4 mb-4">
                    <div className="card">
                      <img
                        src={rider.documents.pancard}
                        className="card-img-top"
                        alt="PAN Card"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">PAN Card</h5>
                        <a
                          href={rider.documents.pancard}
                          className="btn btn-primary btn-sm"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Full Size
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-header bg-light">
              <h4 className="mb-0">Location Information</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <div className="text-muted small">Coordinates</div>
                    {Object.prototype.hasOwnProperty.call(rider, 'location') &&
                      rider?.location?.coordinates?.length === 2 ? (
                      <div>
                        Latitude: {rider.location.coordinates[1]}<br />
                        Longitude: {rider.location.coordinates[0]}
                      </div>
                    ) : (
                      <div className="text-muted">Location Not Available</div>
                    )}


                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <div className="text-muted small">Map View</div>
                    {rider?.location?.coordinates?.length === 2 ? (
                      <a
                        className="btn btn-primary btn-sm"
                        href={`https://www.google.com/maps?q=${rider.location.coordinates[1]},${rider.location.coordinates[0]}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MapPin className="me-2" size={16} />
                        View on Google Maps
                      </a>
                    ) : (
                      <span className="text-muted">Location Not Available</span>
                    )}


                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {rider.YourQrCodeToMakeOnline && (
        <div className="row">
          <div className="col-12">
            <div className="card mb-4 border-0 shadow-sm">
              <div className="card-header bg-light">
                <h4 className="mb-0">QR Code</h4>
              </div>
              <div className="card-body text-center">
                <img
                  src={rider.YourQrCodeToMakeOnline}
                  alt="Rider QR Code"
                  style={{ maxWidth: '250px' }}
                  className="img-fluid mb-3"
                />
                <p className="text-muted">QR Code for rider to go online</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn btn-primary me-2"
          onClick={() => navigate(`/cab/edit-cab-vendor/${rider._id}`)}
        >
          Edit Rider
        </button>
        <button
          className={`btn ${rider.DocumentVerify ? 'btn-success' : 'btn-danger'}`}
          onClick={() => handleDocumentVerifyToggle(rider._id, rider.DocumentVerify)}
        >
          {rider.DocumentVerify ? 'Document Unverify' : 'Document Verify'}
        </button>
      </div>
    </div>
  );
}

export default CabDetail;
