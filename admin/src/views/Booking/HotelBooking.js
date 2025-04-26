import React, { useState, useEffect } from 'react';
import {
    CTableDataCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem,
    CInputGroup,
    CFormInput,
    CFormSelect,
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
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        startDate: '',
        endDate: '',
    });
    const navigate = useNavigate();
    const itemsPerPage = 10;

    const fetchOrders = async () => {
        setLoading(true);

        try {
            const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/hotels/get_all_hotel_booking');
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

    const handleDelete = async (orderId) => {
        try {
            const res = await axios.delete(`https://www.appapi.olyox.com/api/v1/hotels/delete_hotel_order/${orderId}`);
            toast.success(res.data.message);
            fetchOrders();
        } catch (error) {
            console.log("Internal server error", error);
            toast.error("Failed to delete order");
        }
    };

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            const res = await axios.put(`https://www.appapi.olyox.com/api/v1/hotels/update_status_hotel_order/${orderId}`, { status });
            toast.success(res.data.message);
            fetchOrders();
        } catch (error) {
            console.log("Internal server error", error);
            toast.error("Failed to update order status");
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setCurrentPage(1); // Reset to first page on filter change
    };

    // Apply Filters
    const filteredOrders = orders.filter(order => {
        const searchQuery = filters.search.toLowerCase();
        const hotelName = order.HotelUserId?.hotel_name?.toLowerCase() || '';
        const guestName = order.guest_id?.name?.toLowerCase() || '';
        const guestNumber = order.guest_id?.number?.toString() || '';

        const matchesSearch = hotelName.includes(searchQuery) || guestName.includes(searchQuery) || guestNumber.includes(searchQuery);

        const matchesStatus = filters.status ? order.status?.toLowerCase() === filters.status.toLowerCase() : true;

        const bookingDate = order.bookingDate ? new Date(order.bookingDate) : null;
        const startDate = filters.startDate ? new Date(filters.startDate) : null;
        const endDate = filters.endDate ? new Date(filters.endDate) : null;

        const matchesDateRange =
            (!startDate || (bookingDate && bookingDate >= startDate)) &&
            (!endDate || (bookingDate && bookingDate <= endDate));

        return matchesSearch && matchesStatus && matchesDateRange;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredOrders.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const statusOptions = ['Pending', 'Confirmed', 'Checkout', 'CheckIn', 'Cancelled'];

    const handleViewDetails = (id) => {
        navigate(`/hotel/booking-detail/${id}`);
    };

    const heading = ['S.No', 'Hotel Name', 'Order ID', 'User Name', 'User Number', 'Guest Detail', 'Status', 'Payment Method', 'Action'];

    return (
        <>
            {/* Filter Section */}
            <div className="filters mb-3 d-flex gap-3">
                <CFormInput
                    type="text"
                    name="search"
                    placeholder="Search by Name or Number"
                    value={filters.search}
                    onChange={handleFilterChange}
                />
                <CFormSelect name="status" value={filters.status} onChange={handleFilterChange}>
                    <option value="">All Status</option>
                    {statusOptions.map((status) => (
                        <option key={status} value={status.toLowerCase()}>
                            {status}
                        </option>
                    ))}
                </CFormSelect>
                <CFormInput
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                />
                <CFormInput
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                />
            </div>

            {/* Loader or No Data */}
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
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
                                <CTableDataCell>{order.guest_id?.number || 'N/A'}</CTableDataCell>
                                <CTableDataCell>
                                    {order.guestInformation.map(item => (
                                        <div key={item._id}>
                                            Name-{item.guestName} - Number-{item.guestPhone} - Age-{item.guestAge}
                                        </div>
                                    ))}
                                </CTableDataCell>
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
                                <CTableDataCell>{order.paymentMode}</CTableDataCell>
                                <CTableDataCell className="d-flex gap-2">
                                    <CButton
                                        color="info"
                                        size="sm"
                                        className="d-flex text-white align-items-center gap-2"
                                        onClick={() => handleViewDetails(order._id)}
                                    >
                                        <FaEye />
                                        View
                                    </CButton>
                                    <CButton
                                        color="danger"
                                        size="sm"
                                        className="d-flex text-white align-items-center gap-2"
                                        onClick={() => handleDelete(order._id)}
                                    >
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

export default HotelBooking;
