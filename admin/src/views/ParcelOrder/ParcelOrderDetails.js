import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, MapPin, Phone, Clock, User, Navigation, DollarSign, AlertCircle, XCircle, Truck, BadgeCheck,
    Mail
} from 'lucide-react';
import { FaRupeeSign } from 'react-icons/fa';
import axios from 'axios';

const ParcelOrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [parcel, setParcel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchParcelDetails = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`https://www.appapi.olyox.com/api/v1/parcel/get_Single_parcel_by_id/${id}`);
                setParcel(data.data);
            } catch (error) {
                console.error('Error fetching parcel details:', error);
                alert('Failed to load parcel details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchParcelDetails();
    }, [id]);

    const handleBack = () => {
        navigate('/all-parcel-order');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-success';
            case 'cancelled':
                return 'bg-danger';
            case 'pending':
                return 'bg-warning';
            case 'accepted':
                return 'bg-primary';
            default:
                return 'bg-secondary';
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!parcel) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="text-center">
                    <AlertCircle size={48} className="text-danger mb-3" />
                    <h4>Parcel not found</h4>
                    <button className="btn btn-primary mt-3" onClick={handleBack}>
                        Back to List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <button className="btn btn-outline-primary mb-3" onClick={handleBack}>
                <ArrowLeft size={18} className="me-2" /> Back to List
            </button>

            <div className="card shadow-sm border-0">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <div>
                        <h3 className="mb-0">Parcel #{parcel._id.slice(-6)}</h3>
                        <small>ID: {parcel._id}</small>
                    </div>
                    <span className={`badge ${getStatusBadge(parcel.status)} rounded-pill fs-6`}>
                        {parcel.status.charAt(0).toUpperCase() + parcel.status.slice(1)}
                    </span>
                </div>

                <div className="card-body p-4">
                    {/* Locations */}
                    <h5 className="border-bottom pb-2 mb-3">Route Details</h5>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="d-flex mb-4">
                                <div className="me-3 text-center">
                                    <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                                        <MapPin size={18} />
                                    </div>
                                    <div className="bg-secondary mx-auto my-2" style={{ width: 2, height: 40 }}></div>
                                    <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                                        <MapPin size={18} />
                                    </div>
                                </div>
                                <div>
                                    <p className="small text-muted mb-1">Pickup Location</p>
                                    <p className="fw-semibold">{parcel.locations?.pickup?.address}</p>
                                    <p className="small text-muted mt-4 mb-1">Dropoff Location</p>
                                    <p className="fw-semibold">{parcel.locations?.dropoff?.address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="row text-center">
                                <div className="col-6 mb-3">
                                    <Navigation className="text-primary mb-1" size={20} />
                                    <div className="fw-semibold">{parcel.km_of_ride || parcel.totalDistance || 'N/A'} km</div>
                                    <small className="text-muted">Distance</small>
                                </div>
                                <div className="col-6 mb-3">
                                    <FaRupeeSign className="text-primary mb-1" size={20} />
                                    <div className="fw-semibold">₹{parcel.fares?.payableAmount || 0}</div>
                                    <small className="text-muted">Payable</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sender Details */}
                    <h5 className="border-bottom pb-2 mb-3">Sender Details</h5>
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <User className="text-primary me-2" size={18} /> <strong>Name:</strong> {parcel?.customerId?.name}
                        </div>
                        <div className="col-md-4">
                            <Phone className="text-primary me-2" size={18} /> <strong>Phone:</strong> {parcel?.customerId?.number}
                        </div>
                        <div className="col-md-4">
                            <Mail className="text-primary me-2" size={18} /> <strong>Email:</strong> {parcel?.customerId?.email}
                            {/* <Clock className="text-primary me-2" size={18} /> <strong>Booking Time:</strong> {formatDate(parcel.createdAt)} */}
                        </div>
                    </div>

                    {/* Receiver Details */}
                    <h5 className="border-bottom pb-2 mb-3">Receiver Details</h5>
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <User className="text-primary me-2" size={18} /> <strong>Name:</strong> {parcel.name}
                        </div>
                        <div className="col-md-4">
                            <Phone className="text-primary me-2" size={18} /> <strong>Phone:</strong> {parcel.phone}
                        </div>
                        <div className="col-md-4">
                            <Clock className="text-primary me-2" size={18} /> <strong>Booking Time:</strong> {formatDate(parcel.createdAt)}
                        </div>
                        <div className="col-md-4">
                            <Clock className="text-primary me-2" size={18} /> <strong>Appartment:</strong> {parcel?.apartment}
                        </div>
                        {/* <div className="col-md-4">
                            <strong>Saved As:</strong> {parcel.savedAs || 'N/A'}
                        </div>
                        <div className="col-md-4">
                            <strong>Apartment:</strong> {parcel.apartment || 'N/A'}
                        </div>
                        <div className="col-md-4">
                            <strong>Use My Number:</strong> {parcel.useMyNumber ? 'Yes' : 'No'}
                        </div> */}
                    </div>

                    {/* Payment and OTP */}
                    <h5 className="border-bottom pb-2 mb-3">Payment and OTP</h5>
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <DollarSign className="text-primary me-2" size={18} /> <strong>Money Collected:</strong> ₹{parcel.money_collected || 0}
                        </div>
                        <div className="col-md-4">
                            <strong>Payment Mode:</strong> {parcel.money_collected_mode}
                        </div>
                        <div className="col-md-4">
                            <BadgeCheck className="text-primary me-2" size={18} /> <strong>OTP:</strong> {parcel.otp}
                        </div>
                    </div>

                    {/* Parcel Status */}
                    {!parcel.is_parcel_delivered && (
                        <div className="alert alert-warning d-flex align-items-center mb-4">
                            <XCircle size={20} className="text-warning me-2" />
                            Parcel not yet delivered
                        </div>
                    )}

                    {/* Rider & Vehicle Details */}
                    <h5 className="border-bottom pb-2 mt-5 mb-3">Rider & Vehicle Details</h5>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <div className="card bg-light p-3">
                                <div className="d-flex align-items-center mb-2">
                                    <User className="text-primary me-2" size={18} />
                                    <h6 className="mb-0">Rider</h6>
                                </div>
                                <p className="mb-1"><strong>Name:</strong> {parcel.rider_id?.name}</p>
                                <p className="mb-1"><strong>Phone:</strong> {parcel.rider_id?.phone}</p>
                                <p className="mb-0"><strong>Category:</strong> {parcel.rider_id?.category}</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light p-3">
                                <div className="d-flex align-items-center mb-2">
                                    <Truck className="text-primary me-2" size={18} />
                                    <h6 className="mb-0">Vehicle</h6>
                                </div>
                                <p className="mb-1"><strong>Name:</strong> {parcel.rider_id?.rideVehicleInfo?.vehicleName}</p>
                                <p className="mb-1"><strong>Type:</strong> {parcel.rider_id?.rideVehicleInfo?.vehicleType}</p>
                                <p className="mb-0"><strong>Number:</strong> {parcel.rider_id?.rideVehicleInfo?.VehicleNumber}</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light p-3">
                                <div className="d-flex align-items-center mb-2">
                                    <Navigation className="text-primary me-2" size={18} />
                                    <h6 className="mb-0">Ride Info</h6>
                                </div>
                                <p className="mb-1"><strong>Ride ID:</strong> {parcel.ride_id}</p>
                                <p className="mb-0"><strong>Driver Accept Time:</strong> {formatDate(parcel.driver_accept_time)}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ParcelOrderDetails;
