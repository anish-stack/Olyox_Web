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
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Delete } from 'lucide-react';

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
            const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/tiffin/get_all_orders');
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

    const handleDelete = async (vendorId) => {
        try {
            const res = await axios.delete(`https://www.appapi.olyox.com/api/v1/tiffin/delete_tiffin_order/${vendorId}`);
            toast.success(res.data.message);
            fetchOrders();
        } catch (error) {
            console.log("Internal server error", error)
        }
    }

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            const res = await axios.put(`https://www.appapi.olyox.com/api/v1/tiffin/update_tiffin_order_status/${orderId}`, { status });
            toast.success(res.data.message);
            fetchOrders(); // refetch after update
        } catch (error) {
            console.log("Internal server error", error);
            toast.error("Failed to update order status");
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

    const statusOptions = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (orderId) => {
        navigate(`/order/detail/${orderId}`);
    };

    const heading = ['S.No', 'Restaurant Name', 'Order ID', 'User Name', 'User Number', 'Items', 'Total Price', 'Status', 'Payment Method', 'Delete'];

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
                                <CTableDataCell>{order?.Order_Id}</CTableDataCell>
                                <CTableDataCell>{order.user?.name || 'N/A'}</CTableDataCell>
                                <CTableDataCell>{order.user?.number || 'N/A'}</CTableDataCell>
                                <CTableDataCell>
                                    {order.items.map(item => (
                                        <div key={item._id}>
                                            {item?.foodItem_id?.food_name} - {item?.quantity} x {item?.price} INR
                                        </div>
                                    ))}
                                </CTableDataCell>
                                <CTableDataCell>{order?.totalPrice} INR</CTableDataCell>
                                <CTableDataCell>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                        style={{ padding: '4px 8px', borderRadius: '4px' }}
                                    >
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </CTableDataCell>
                                <CTableDataCell>{order?.paymentMethod}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="danger"
                                        size="sm"
                                        className="d-flex align-items-center gap-2"
                                        onClick={() => handleDelete(order._id)}
                                    >
                                        <Delete />
                                        Delete
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

export default TiffinBooking;
