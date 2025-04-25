import axios from 'axios';
import { Bath, Bell, Bolt, Clock, DoorOpen, FireExtinguisher, ParkingCircle, Shield, Snowflake, Tv, Utensils, Wifi } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FaStar, FaUsers, FaTags, FaPercent, FaBuilding, FaVideo, FaBroom, FaFirstAid, FaUtensils } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
const HotelListing = () => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const { id } = useParams();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchListings = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://www.appapi.olyox.com/api/v1/hotels/get_hotel_listing_by_hotel_user/${id}`);
            setListings(data.data);
        } catch (error) {
            console.error("Error fetching listings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [id]);

    const AmenityIcon = ({ name, isAvailable }) => {
        const icons = {
            freeWifi: Wifi,
            TV: Tv,
            parkingFacility: ParkingCircle,
            elevator: FaBuilding, // Replaced with FaBuilding
            cctvCameras: FaVideo,  // Replaced with FaVideo
            diningArea: Utensils,
            privateEntrance: DoorOpen,
            reception: Bell,
            security: Shield,
            checkIn24_7: Clock,
            dailyHousekeeping: FaBroom,
            fireExtinguisher: FireExtinguisher,
            firstAidKit: FaFirstAid,
            buzzerDoorBell: Bell,
            attachedBathroom: Bath,
            AC: Snowflake,
            kitchen: FaUtensils,
            powerBackup: Bolt
          };

        const Icon = icons[name];
        if (!Icon) return null;

        return (
            <div className={`d-flex align-items-center ${isAvailable ? 'text-success' : 'text-muted'}`}>
                <Icon className="me-2" />
                <span>{name.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
        );
    };

    const ImageGallery = ({ images, roomId }) => (
        <div id={`carousel-${roomId}`} className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                {Object.entries(images).map(([key, image], index) => {
                    if (key.includes('image') && image.url) {
                        return (
                            <button
                                key={index}
                                type="button"
                                data-bs-target={`#carousel-${roomId}`}
                                data-bs-slide-to={index}
                                className={index === 0 ? 'active' : ''}
                                aria-current={index === 0 ? 'true' : 'false'}
                                aria-label={`Slide ${index + 1}`}
                            ></button>
                        );
                    }
                    return null;
                })}
            </div>
            <div className="carousel-inner rounded-4 overflow-hidden">
                {Object.entries(images).map(([key, image], index) => {
                    if (key.includes('image') && image.url) {
                        return (
                            <div key={key} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                <img
                                    src={image.url}
                                    className="d-block w-100"
                                    alt={`Room view ${index + 1}`}
                                    style={{ height: '400px', objectFit: 'cover' }}
                                />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${roomId}`} data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${roomId}`} data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );

    return (
        <div className="container-fluid py-5 bg-light">
            <div className="row g-4">
                {listings.map((room) => (
                    <div key={room._id} className="col-12">
                        <div className="card border-0 shadow-sm overflow-hidden">
                            <div className="row g-0">
                                <div className="col-lg-6">
                                    <ImageGallery images={room} roomId={room._id} />
                                </div>
                                <div className="col-lg-6">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h2 className="card-title h3 mb-1">{room.room_type}</h2>
                                                <div className="d-flex flex-wrap gap-2 align-items-center">
                                                    <span className="badge bg-primary">
                                                        <FaUsers className="me-1" />
                                                        {room.allowed_person} Persons
                                                    </span>
                                                    {room.rating_number > 0 && (
                                                        <span className="badge bg-warning text-dark">
                                                            <FaStar className="me-1" />
                                                            {room.rating_number}
                                                        </span>
                                                    )}
                                                    <span className={`badge ${room.isRoomAvailable ? 'bg-success' : 'bg-danger'}`}>
                                                        {room.isRoomAvailable ? 'Available' : 'Booked'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <div className="text-decoration-line-through text-muted">₹{room.cut_price}</div>
                                                <div className="h2 mb-0 text-primary">₹{room.book_price}</div>
                                                <span className="badge bg-danger">
                                                    <FaPercent className="me-1" />
                                                    {room.discount_percentage}% OFF
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h6 className="mb-2">Tags:</h6>
                                            <div className="d-flex flex-wrap gap-2">
                                                {room.has_tag.map((tag, index) => (
                                                    <span key={index} className="badge bg-light text-dark">
                                                        <FaTags className="me-1" />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h6 className="mb-2">Amenities:</h6>
                                            <div className="row g-3">
                                                {Object.entries(room.amenities).map(([key, value]) => (
                                                    <div key={key} className="col-md-6">
                                                        <AmenityIcon name={key} isAvailable={value} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {room.isPackage && room.package_add_ons.length > 0 && (
                                            <div className="mb-4">
                                                <h6 className="mb-2">Package Includes:</h6>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {room.package_add_ons.map((addon, index) => (
                                                        <span key={index} className="badge bg-info">
                                                            {addon}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-4">
                                            <h6 className="mb-2">Cancellation Policy:</h6>
                                            <ul className="list-unstyled mb-0">
                                                {room.cancellation_policy.map((policy, index) => (
                                                    <li key={index} className="text-muted">• {policy}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mt-4">
                                            <div>
                                                {room.is_tax_applied && (
                                                    <small className="text-muted">
                                                        +₹{room.tax_fair} tax applicable
                                                    </small>
                                                )}
                                            </div>
                                            {/* <button
                                                className="btn btn-primary btn-lg"
                                                disabled={!room.isRoomAvailable}
                                            >
                                                Book Now
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {listings.length === 0 && (
                <div className="text-center py-5">
                    <h3 className="text-muted">No rooms available</h3>
                    <p className="mb-0">There are currently no rooms listed.</p>
                </div>
            )}
        </div>
    );
};

export default HotelListing;
