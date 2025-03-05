import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const AllRiderLocation = () => {
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch both riders and vendors data
    const fetchRidersAndVendors = async () => {
        setLoading(true);
        try {
            // Fetch riders
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
        fetchRidersAndVendors();
    }, []);

    // Default center and zoom level
    const center = [28.4609853, 76.9541603]; // Example coordinates

    return (
        <div style={{ height: '500px', width: '100%' }}>
            {loading ? (
                <p>Loading map...</p>
            ) : (
                <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="© OpenStreetMap contributors"
                    />
                    
                    {/* Render Riders */}
                    {riders.map((rider) => (
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
                    ))}
                </MapContainer>
            )}
        </div>
    );
};

export default AllRiderLocation;
