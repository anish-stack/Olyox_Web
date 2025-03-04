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

const HotelBooking = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const itemsPerPage = 10;

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:3100/api/v1/hotels/get_all_hotel_booking');
            setOrders(Array.isArray(data.data) ? data.data : []);
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

    console.log("orders", orders)

    // Filter orders by restaurant name or order ID based on the searchTerm
    const filteredOrders = orders.filter(order => {
        const searchQuery = searchTerm.toLowerCase();
        return (
            order.HotelUserId?.hotel_name?.toLowerCase().includes(searchQuery) ||
            order.Booking_id?.toLowerCase().includes(searchQuery)
        );
    });
    console.log("filteredOrders",filteredOrders)

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredOrders.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    console.log("currentData",currentData)

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (id) => {
        navigate(`/hotel/booking-detail/${id}`);
    }

    const heading = ['S.No', 'Hotel Name', 'Order ID', 'User Name', 'User Number', 'Guest Detail', 'Status', 'Payment Method', 'Action'];

    return (
        <>
            {/* Filter Section - Search input */}
            <div className="filter-container mb-3">
                <CInputGroup>
                    <CInputGroupText>Search</CInputGroupText>
                    <CFormInput
                        placeholder="Search by restaurant name or order ID"
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
                    <p>No orders available</p>
                </div>
            ) : (
                <Table
                    heading="Orders"
                    btnText=""
                    btnURL="/add-order"
                    tableHeading={heading}
                    tableContent={
                        currentData.map((order, index) => (
                            <CTableRow key={order._id}>
                                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                                <CTableDataCell>{order.HotelUserId?.hotel_name}</CTableDataCell>
                                <CTableDataCell>{order.Booking_id}</CTableDataCell>
                                <CTableDataCell>{order.guest_id?.name || 'N/A'}</CTableDataCell>
                                <CTableDataCell>{order.guest_id?.phone || 'N/A'}</CTableDataCell>
                                <CTableDataCell>
                                    {order.guestInformation.map(item => (
                                        <div key={item._id}>
                                            Name-{item.guestName} - Number-{item.guestPhone} - Age-{item.guestAge}
                                        </div>
                                    ))}
                                </CTableDataCell>
                                {/* <CTableDataCell>{order.totalPrice} INR</CTableDataCell> */}
                                <CTableDataCell>{order.status}</CTableDataCell>
                                <CTableDataCell>{order.paymentMode}</CTableDataCell>
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
                        ))
                    }
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

export default HotelBooking
