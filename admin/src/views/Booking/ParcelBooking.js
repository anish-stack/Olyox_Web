import React, { useState, useEffect } from 'react';
import {
    CTableDataCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CButton,
} from '@coreui/react';
import { FaEye } from 'react-icons/fa';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ParcelBooking = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const itemsPerPage = 7;

    
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/parcel/get_parcel_order');
            const allData = data.data.reverse();
            setOrders(Array.isArray(allData) ? allData : []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders. Please try again.');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Filter orders by ride status, pickup location, or other relevant fields
    const filteredOrders = orders.filter(order => {
        const searchQuery = searchTerm.toLowerCase();
        return (
            order.pickup_desc.toLowerCase().includes(searchQuery) ||
            order.drop_desc.toLowerCase().includes(searchQuery) ||
            order.RideOtp.toLowerCase().includes(searchQuery)
        );
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredOrders.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (id) => {
        navigate(`/cab/all-cab-detail/${id}`);
    }

    const heading = ['S.No', 'User Name', 'User Number', 'Pickup Location', 'Drop Location', 'Rider Name', 'Rider Number', 'Ride OTP', 'Ride Distance (Km)', 'Status', 'Action'];

    return (
        <>
            {/* Filter Section - Search input */}
            <div className="filter-container mb-3">
                <CInputGroup>
                    <CInputGroupText>Search</CInputGroupText>
                    <CFormInput
                        placeholder="Search by pickup location, drop location, or ride OTP"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </CInputGroup>
            </div>

            {/* Loader or No Data */}
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="no-data">
                    <p>No rides available</p>
                </div>
            ) : (
                <Table
                    heading="Rides"
                    btnText=""
                    btnURL="/add-ride"
                    tableHeading={heading}
                    tableContent={currentData.map((order, index) => (
                        <CTableRow key={order._id}>
                            <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                            <CTableDataCell>{order?.customerId?.name || 'N/A'}</CTableDataCell>
                            <CTableDataCell>{order?.customerId?.number || 'N/A'}</CTableDataCell>
                            <CTableDataCell>{order.pickupGeo}</CTableDataCell>
                            <CTableDataCell>{order.dropoffLocation}</CTableDataCell>
                            <CTableDataCell>{order.driverId?.name || 'N/A'}</CTableDataCell>
                            <CTableDataCell>{order.driverId?.phone || 'N/A'}</CTableDataCell>
                            <CTableDataCell>{order.RideOtp}</CTableDataCell>
                            <CTableDataCell>{order.kmOfRide} km</CTableDataCell>
                            <CTableDataCell>{order.status}</CTableDataCell>
                            <CTableDataCell>
                                <CButton
                                    color="info"
                                    size="sm"
                                    className="d-flex align-items-center gap-2"
                                    onClick={() => handleViewDetails(order._id)}
                                >
                                    <FaEye />
                                    View Details
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                    pagination={
                        <CPagination className="justify-content-center">
                            <CPaginationItem
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Previous
                            </CPaginationItem>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <CPaginationItem
                                    key={index}
                                    active={index + 1 === currentPage}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </CPaginationItem>
                            ))}
                            <CPaginationItem
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next
                            </CPaginationItem>
                        </CPagination>
                    }
                />
            )}
        </>
    );
};

export default ParcelBooking
