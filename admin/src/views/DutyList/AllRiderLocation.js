import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const AllRiderLocation = () => {
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRider, setSelectedRider] = useState(null);

    // Fetch all active riders
    const fetchRiders = async () => {
        setLoading(true);
        try {
            const { data: ridersData } = await axios.get('https://demoapi.olyox.com/api/v1/rider');
            const activeRiders = ridersData.filter(rider => rider.isActive === true);
            setRiders(Array.isArray(activeRiders) ? activeRiders : []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRiders();
    }, []);

    // Default map center
    const defaultCenter = [28.4609853, 76.9541603];

    // Function to handle dropdown change
    const handleRiderSelect = (event) => {
        const riderId = event.target.value;
        const rider = riders.find(r => r._id === riderId);
        if (rider && rider.location && rider.location.coordinates) {
            setSelectedRider(rider);
        }
    };

    return (
        <div style={{ height: '600px', width: '100%' }}>
            {/* Dropdown for Selecting Rider */}
            <select onChange={handleRiderSelect} style={{ marginBottom: '10px', padding: '8px', fontSize: '16px' }}>
                <option value="">Select a Rider</option>
                {riders.map(rider => (
                    <option key={rider._id} value={rider._id}>
                        {rider.name}
                    </option>
                ))}
            </select>

            {loading ? (
                <p>Loading map...</p>
            ) : (
                <MapContainer center={defaultCenter} zoom={13} style={{ height: '500px', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="© OpenStreetMap contributors"
                    />

                    {/* Component to move map to selected rider */}
                    {selectedRider && <MapFocus rider={selectedRider} />}

                    {/* Render all riders on the map */}
                    {riders.map((rider) => {
                        if (!rider.location || !rider.location.coordinates) return null;
                        return (
                            <Marker
                                key={rider._id}
                                position={[rider.location.coordinates[1], rider.location.coordinates[0]]}
                                icon={L.icon({
                                    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Rider icon
                                    iconSize: [32, 32],
                                    iconAnchor: [16, 32]
                                })}
                            >
                                <Popup>
                                    <b>{rider.name}</b> <br />
                                    Vehicle: {rider.rideVehicleInfo.vehicleName} ({rider.rideVehicleInfo.vehicleType}) <br />
                                    Phone: {rider.phone}
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            )}
        </div>
    );
};

// Component to move the map to the selected rider's location
const MapFocus = ({ rider }) => {
    const map = useMap();
    useEffect(() => {
        if (rider && rider.location && rider.location.coordinates) {
            map.setView([rider.location.coordinates[1], rider.location.coordinates[0]], 15);
        }
    }, [rider, map]);
    return null;
};

export default AllRiderLocation;
