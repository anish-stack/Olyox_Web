import React, { useEffect, useState } from 'react';
import { Truck, MapPin, Phone, Star, FileText, CheckCircle, XCircle, ArrowLeft, CreditCard, Calendar, Award, Home, Users, Clock, CreditCard as Payment, Tag, Clipboard, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const HotelBookingDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate()
    // State for storing booking data
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock function to fetch booking details
    const fetchBookingDetails = async () => {
        setLoading(true);
        try {

            // In a real implementation, you would use axios like this:
            const { data } = await axios.get(`http://www.appapi.olyox.com/api/v1/hotels/get_single_hotel_booking/${id}`);
            console.log("data",data)
            setBooking(data.data);
        } catch (error) {
            console.error('Error fetching booking details:', error);
            alert('Failed to load booking details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        fetchBookingDetails();
    }, []);

    const handleUpdateBookingStatus = async (id, status) => {
        // Mock API call
        console.log(`Updating booking status for ${id} to ${status}`);
        setBooking(prev => ({
            ...prev,
            status: status
        }));
        // Show notification
        alert(`Booking status updated to ${status} successfully.`);
    };

    const handleCheckInUser = async (id) => {
        // Mock API call
        console.log(`Checking in user for booking ${id}`);
        setBooking(prev => ({
            ...prev,
            isUserCheckedIn: true
        }));
        // Show notification
        alert('User checked in successfully.');
    };

    const handleCheckOutUser = async (id) => {
        // Mock API call
        console.log(`Checking out user for booking ${id}`);
        setBooking(prev => ({
            ...prev,
            userCheckOutStatus: true
        }));
        // Show notification
        alert('User checked out successfully.');
    };

    const handleBackToList = () => {
        navigate('/hotel/all-hotel-booking')
        // console.log('Navigate back to bookings list');
        // In a real app, this would use navigation
    };

    // Calculate stay duration in days
    const calculateStayDuration = (checkIn, checkOut) => {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const diffTime = Math.abs(checkOutDate - checkInDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
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

    if (!booking) {
        return (
            <div className="text-center my-5">
                <h3>Booking not found</h3>
                <button className="btn btn-primary mt-3" onClick={handleBackToList}>
                    Back to Bookings List
                </button>
            </div>
        );
    }

    const stayDuration = calculateStayDuration(booking.checkInDate, booking.checkOutDate);

    return (
        <div className="container py-4">
            <button
                className="btn btn-outline-primary mb-4"
                onClick={handleBackToList}
            >
                <ArrowLeft className="me-2" size={18} /> Back to Bookings List
            </button>

            <div className="row">
                <div className="col-12">
                    <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <div>
                                <h3 className="mb-0">Booking #{booking.Booking_id}</h3>
                                <div className="small">ID: {booking._id}</div>
                            </div>
                            <span className={`badge ${booking.status === 'Confirmed' ? 'bg-success' :
                                    booking.status === 'Cancelled' ? 'bg-danger' :
                                        booking.status === 'Pending' ? 'bg-warning' : 'bg-secondary'
                                } rounded-pill fs-6`}>
                                {booking.status}
                            </span>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4 mb-4">
                                    <img
                                        src={booking.listing_id.main_image.url}
                                        alt="Room"
                                        className="img-fluid rounded shadow-sm"
                                        style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <Home className="text-primary me-2" size={18} />
                                                <div>
                                                    <div className="text-muted small">Hotel</div>
                                                    <div className="fw-bold">{booking.HotelUserId.hotel_name}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <MapPin className="text-primary me-2" size={18} />
                                                <div>
                                                    <div className="text-muted small">Location</div>
                                                    <div>{booking.HotelUserId.hotel_zone}, {booking.HotelUserId.area}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <Phone className="text-primary me-2" size={18} />
                                                <div>
                                                    <div className="text-muted small">Hotel Phone</div>
                                                    <div>{booking.HotelUserId.hotel_phone}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <Tag className="text-primary me-2" size={18} />
                                                <div>
                                                    <div className="text-muted small">Room Type</div>
                                                    <div>{booking.listing_id.room_type}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <Calendar className="text-primary me-2" size={18} />
                                                <div>
                                                    <div className="text-muted small">Check-in Date</div>
                                                    <div>{new Date(booking.checkInDate).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <Calendar className="text-primary me-2" size={18} />
                                                <div>
                                                    <div className="text-muted small">Check-out Date</div>
                                                    <div>{new Date(booking.checkOutDate).toLocaleDateString()}</div>
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
                            <h4 className="mb-0">Guest Information</h4>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                {booking.guestInformation.map((guest, index) => (
                                    <li key={index} className="list-group-item">
                                        <h5>Guest #{index + 1}</h5>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Name:</span>
                                            <span className="fw-bold">{guest.guestName}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Phone:</span>
                                            <span className="fw-bold">{guest.guestPhone}</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span>Age:</span>
                                            <span className="fw-bold">{guest.guestAge}</span>
                                        </div>
                                    </li>
                                ))}
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Total Guests:</span>
                                        <span className="fw-bold">{booking.numberOfGuests}</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Stay Duration:</span>
                                        <span className="fw-bold">{stayDuration} {stayDuration === 1 ? 'day' : 'days'}</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Notes:</span>
                                        <span className="fw-bold">{booking.anyNotes}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-light">
                            <h4 className="mb-0">Booking Details</h4>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Booking ID:</span>
                                        <span className="fw-bold">{booking.Booking_id}</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Booking Date:</span>
                                        <span className="fw-bold">{new Date(booking.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Booking Mode:</span>
                                        <span className="fw-bold">{booking.modeOfBooking}</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Payment Status:</span>
                                        <span className={`badge ${booking.booking_payment_done ? 'bg-success' : 'bg-warning'}`}>
                                            {booking.booking_payment_done ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Payment Mode:</span>
                                        <span className="fw-bold">{booking.paymentMode}</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Check-in Status:</span>
                                        <span className={`badge ${booking.isUserCheckedIn ? 'bg-success' : 'bg-warning'}`}>
                                            {booking.isUserCheckedIn ? 'Checked In' : 'Not Checked In'}
                                        </span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Check-out Status:</span>
                                        <span className={`badge ${booking.userCheckOutStatus ? 'bg-success' : 'bg-warning'}`}>
                                            {booking.userCheckOutStatus ? 'Checked Out' : 'Not Checked Out'}
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-light">
                            <h4 className="mb-0">Room Details</h4>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Room Type:</span>
                                        <span className="fw-bold">{booking.listing_id.room_type}</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Max Occupancy:</span>
                                        <span className="fw-bold">{booking.listing_id.allowed_person} persons</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Original Price:</span>
                                        <span className="fw-bold text-decoration-line-through">₹{booking.listing_id.cut_price}</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Discounted Price:</span>
                                        <span className="fw-bold text-success">₹{booking.listing_id.book_price}</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Discount:</span>
                                        <span className="fw-bold text-danger">{booking.listing_id.discount_percentage}% OFF</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Tax Applied:</span>
                                        <span className="fw-bold">{booking.listing_id.is_tax_applied ? 'Yes' : 'No'}</span>
                                    </div>
                                </li>
                                {booking.listing_id.is_tax_applied && (
                                    <li className="list-group-item">
                                        <div className="d-flex justify-content-between">
                                            <span>Tax Amount:</span>
                                            <span className="fw-bold">₹{booking.listing_id.tax_fair}</span>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-light">
                            <h4 className="mb-0">Package Details</h4>
                        </div>
                        <div className="card-body">
                            {booking.listing_id.isPackage ? (
                                <>
                                    <h5 className="mb-3">Package Add-ons:</h5>
                                    <ul className="list-group list-group-flush">
                                        {booking.listing_id.package_add_ons.map((addon, index) => (
                                            <li key={index} className="list-group-item">
                                                <div className="d-flex align-items-center">
                                                    <Check className="text-success me-2" size={18} />
                                                    <span>{addon}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted">No package add-ons available for this booking.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-light">
                            <h4 className="mb-0">Cancellation Policy</h4>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                {booking.listing_id.cancellation_policy.map((policy, index) => (
                                    <li key={index} className="list-group-item">
                                        <div className="d-flex align-items-start">
                                            <Clipboard className="text-danger me-2 mt-1" size={18} />
                                            <span>{policy}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-light">
                            <h4 className="mb-0">Room Images</h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {['main_image', 'second_image', 'third_image', 'fourth_image', 'fifth_image'].map((imageKey, index) => (
                                    booking.listing_id[imageKey] && (
                                        <div key={index} className="col-md-4 mb-4">
                                            <div className="card">
                                                <img
                                                    src={booking.listing_id[imageKey].url}
                                                    className="card-img-top"
                                                    alt={`Room Image ${index + 1}`}
                                                    style={{ height: '200px', objectFit: 'cover' }}
                                                />
                                                <div className="card-body">
                                                    <h5 className="card-title">Room View {index + 1}</h5>
                                                    <a
                                                        href={booking.listing_id[imageKey].url}
                                                        className="btn btn-primary btn-sm"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        View Full Size
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-end mb-4">
                {!booking.isUserCheckedIn && (
                    <button
                        className="btn btn-success me-2"
                        onClick={() => handleCheckInUser(booking._id)}
                    >
                        Check In Guest
                    </button>
                )}

                {/* {booking.isUserCheckedIn && !booking.userCheckOutStatus && (
                    <button
                        className="btn btn-warning me-2"
                        onClick={() => handleCheckOutUser(booking._id)}
                    >
                        Check Out Guest
                    </button>
                )} */}

                {/* <div className="dropdown me-2">
                    <button
                        className="btn btn-primary dropdown-toggle"
                        type="button"
                        id="statusDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Update Status
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="statusDropdown">
                        <li><button className="dropdown-item" onClick={() => handleUpdateBookingStatus(booking._id, 'Confirmed')}>Confirm</button></li>
                        <li><button className="dropdown-item" onClick={() => handleUpdateBookingStatus(booking._id, 'Cancelled')}>Cancel</button></li>
                        <li><button className="dropdown-item" onClick={() => handleUpdateBookingStatus(booking._id, 'Pending')}>Mark as Pending</button></li>
                    </ul>
                </div> */}

                {/* <button
                    className="btn btn-outline-primary"
                    onClick={() => console.log(`Print booking details for ${booking._id}`)}
                >
                    Print Details
                </button> */}
            </div>
        </div>
    );
}

export default HotelBookingDetail
