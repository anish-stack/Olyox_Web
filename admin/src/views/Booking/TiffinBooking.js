import React, { useState, useEffect } from 'react';
import {
    CTableDataCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem,
    CButton,
    CInputGroup,
    CInputGroupText,
    CFormInput,
} from '@coreui/react';
import { FaEye } from 'react-icons/fa';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const TiffinBooking = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const itemsPerPage = 10;

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:3100/api/v1/tiffin/get_all_orders');
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

    // Filter orders by restaurant name or order ID based on the searchTerm
    const filteredOrders = orders.filter(order => {
        const searchQuery = searchTerm.toLowerCase();
        return (
            order.restaurant?.restaurant_name?.toLowerCase().includes(searchQuery) ||
            order.Order_Id?.toLowerCase().includes(searchQuery)
        );
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredOrders.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (orderId) => {
        navigate(`/order/detail/${orderId}`);
    };

    const heading = ['S.No', 'Restaurant Name', 'Order ID', 'User Name', 'User Number', 'Items', 'Total Price', 'Status', 'Payment Method'];

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
                                <CTableDataCell>{order.restaurant?.restaurant_name}</CTableDataCell>
                                <CTableDataCell>{order.Order_Id}</CTableDataCell>
                                <CTableDataCell>{order.user?.name || 'N/A'}</CTableDataCell>
                                <CTableDataCell>{order.user?.phone || 'N/A'}</CTableDataCell>
                                <CTableDataCell>
                                    {order.items.map(item => (
                                        <div key={item._id}>
                                            {item.foodItem_id.food_name} - {item.quantity} x {item.price} INR
                                        </div>
                                    ))}
                                </CTableDataCell>
                                <CTableDataCell>{order.totalPrice} INR</CTableDataCell>
                                <CTableDataCell>{order.status}</CTableDataCell>
                                <CTableDataCell>{order.paymentMethod}</CTableDataCell>
                                {/* <CTableDataCell>
                                    <CButton
                                        color="info"
                                        size="sm"
                                        className="d-flex align-items-center gap-2"
                                        onClick={() => handleViewDetails(order.Order_Id)}
                                    >
                                        <FaEye />
                                        View Details
                                    </CButton>
                                </CTableDataCell> */}
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

export default TiffinBooking;
