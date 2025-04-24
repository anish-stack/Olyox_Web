import React, { useEffect, useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Car, 
  Calendar, 
  Clock, 
  User, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Navigation
} from 'lucide-react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function CabBookingDetail() {
    const {id} = useParams();
    const navigate = useNavigate()
  // Mock data based on the provided structure
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchBookingDetails = async () => {
      
      setLoading(true);
      try {
        const { data } = await axios.get(`https://demoapi.olyox.com/api/v1/rides/single_rides/${id}`);
        setBooking(data.data);
      } catch (error) {
        console.log('Error fetching booking details:', error);
        alert('Failed to load booking details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, []);

  const handleBackToList = () => {
    navigate('/cab/all-cab-booking')
    // console.log('Navigate back to rides list');
    // In a real app, this would use navigation
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-success';
      case 'cancelled':
        return 'bg-danger';
      case 'ongoing':
        return 'bg-primary';
      case 'pending':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <div className="card text-center shadow-sm" style={{ maxWidth: '400px' }}>
          <div className="card-body p-5">
            <div className="text-danger mb-4">
              <AlertCircle size={48} />
            </div>
            <h3 className="card-title mb-3">Ride not found</h3>
            <button 
              className="btn btn-primary mt-3"
              onClick={handleBackToList}
            >
              Back to Rides List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container">
        <button
          className="btn btn-outline-primary mb-4 d-flex align-items-center"
          onClick={handleBackToList}
        >
          <ArrowLeft className="me-2" size={18} /> Back to Rides List
        </button>

        {/* Header Card */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-0">Ride #{booking._id.substring(booking._id.length - 6)}</h1>
              <p className="small mb-0 opacity-75">ID: {booking._id}</p>
            </div>
            <span className={`badge ${getStatusBadgeClass(booking.rideStatus)} rounded-pill fs-6`}>
              {booking.rideStatus.charAt(0).toUpperCase() + booking.rideStatus.slice(1)}
            </span>
          </div>
          
          <div className="card-body p-4">
            <div className="row">
              {/* Ride Route */}
              <div className="col-md-6 mb-4">
                <h2 className="h5 border-bottom pb-2 mb-3">Ride Route</h2>
                
                <div className="d-flex">
                  <div className="me-3 mt-1">
                    <div className="rounded-circle bg-success d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                      <MapPin className="text-white" size={16} />
                    </div>
                    <div className="mx-auto my-1 bg-secondary" style={{ width: '2px', height: '40px' }}></div>
                    <div className="rounded-circle bg-danger d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                      <MapPin className="text-white" size={16} />
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="mb-3">
                      <p className="text-muted small mb-1">Pickup Location</p>
                      <p className="fw-medium">{booking.pickup_desc}</p>
                    </div>
                    <div>
                      <p className="text-muted small mb-1">Drop Location</p>
                      <p className="fw-medium">{booking.drop_desc}</p>
                    </div>
                  </div>
                </div>
                
                <div className="row mt-4">
                  <div className="col-6">
                    <div className="card bg-light">
                      <div className="card-body py-2 px-3">
                        <div className="d-flex align-items-center">
                          <Navigation className="text-primary me-2" size={18} />
                          <div>
                            <p className="text-muted small mb-0">Distance</p>
                            <p className="fw-medium mb-0">{booking.kmOfRide} km</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card bg-light">
                      <div className="card-body py-2 px-3">
                        <div className="d-flex align-items-center">
                          <Clock className="text-primary me-2" size={18} />
                          <div>
                            <p className="text-muted small mb-0">ETA</p>
                            <p className="fw-medium mb-0">{booking.EtaOfRide}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ride Details */}
              <div className="col-md-6">
                <h2 className="h5 border-bottom pb-2 mb-3">Ride Details</h2>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center">
                      <Calendar className="text-primary me-2" size={18} />
                      <div>
                        <p className="text-muted small mb-0">Booking Date</p>
                        <p className="fw-medium mb-0">{formatDate(booking.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center">
                      <Car className="text-primary me-2" size={18} />
                      <div>
                        <p className="text-muted small mb-0">Vehicle Type</p>
                        <p className="fw-medium mb-0">{booking.vehicleType}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center">
                      <User className="text-primary me-2" size={18} />
                      <div>
                        <p className="text-muted small mb-0">User Phone</p>
                        <p className="fw-medium mb-0">{booking.user.number}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-center">
                      <DollarSign className="text-primary me-2" size={18} />
                      <div>
                        <p className="text-muted small mb-0">Payment Status</p>
                        <p className="fw-medium mb-0">{booking.is_ride_paid ? 'Paid' : 'Unpaid'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {booking.rideStatus === 'cancelled' && (
                  <div className="alert alert-danger d-flex align-items-start mt-3">
                    <XCircle className="text-danger me-2 mt-1" size={18} />
                    <div>
                      <p className="fw-medium mb-0">Cancelled by {booking.rideCancelBy}</p>
                      <p className="small text-muted mb-0">
                        {formatDate(booking.rideCancelTime)}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="alert alert-primary d-flex align-items-center mt-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                    <span className="fw-bold text-primary">{booking.RideOtp}</span>
                  </div>
                  <p className="mb-0">Ride OTP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Driver Details */}
        <div className="card mb-4 border-0 shadow-sm">
          <div className="card-header bg-light">
            <h2 className="h5 mb-0">Driver Details</h2>
          </div>
          
          <div className="card-body p-4">
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="card bg-light text-center">
                  <div className="card-body p-4">
                    <div className="bg-secondary bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '96px', height: '96px' }}>
                      <User size={40} className="text-secondary" />
                    </div>
                    <h3 className="h5 mb-1">{booking?.rider?.name}</h3>
                    <p className="text-muted mb-2">{booking?.rider?.phone}</p>
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                      BH: {booking?.rider?.BH}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="col-md-8">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <h3 className="h6 text-muted mb-3">Vehicle Information</h3>
                    <div className="card bg-light">
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Vehicle</span>
                          <span className="fw-medium">{booking?.rider?.rideVehicleInfo?.vehicleName}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Type</span>
                          <span className="fw-medium">{booking?.rider?.rideVehicleInfo?.vehicleType}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Number</span>
                          <span className="fw-medium">{booking?.rider?.rideVehicleInfo?.VehicleNumber}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Price/km</span>
                          <span className="fw-medium">₹{booking?.rider?.rideVehicleInfo?.PricePerKm}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-4">
                    <h3 className="h6 text-muted mb-3">Driver Stats</h3>
                    <div className="card bg-light">
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Total Rides</span>
                          <span className="fw-medium">{booking?.rider?.TotalRides}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Ratings</span>
                          <span className="fw-medium">{booking?.rider?.Ratings || 'No ratings'}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Status</span>
                          <span className={`fw-medium ${booking?.rider?.isActive ? 'text-success' : 'text-danger'}`}>
                            {booking?.rider?.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Verified</span>
                          <span className={`fw-medium ${booking?.rider?.DocumentVerify ? 'text-success' : 'text-danger'}`}>
                            {booking?.rider?.DocumentVerify ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {booking?.rider?.documents && (
                  <div>
                  <h3 className="h6 text-muted mb-3">Documents</h3>
                  <div className="row">
                    {Object.entries(booking?.rider?.documents).map(([key, value]) => (
                      <div key={key} className="col-md-4 col-sm-6 mb-3">
                        <div className="card bg-light text-center">
                          <div className="card-body py-2 px-3">
                            <p className="text-muted small mb-1 text-capitalize">{key}</p>
                            <a 
                              href={value} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-primary"
                            >
                              View Document
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                )}
                
                
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        {/* <div className="d-flex justify-content-end gap-2 mb-4">
          {booking.rideStatus !== 'cancelled' && (
            <button className="btn btn-danger">
              Cancel Ride
            </button>
          )}
          <button className="btn btn-primary">
            Contact Driver
          </button>
          <button className="btn btn-light">
            Print Details
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default CabBookingDetail;