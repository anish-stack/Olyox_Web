import React from 'react';
import {
    CTableDataCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem,
    CFormSelect,
    CFormInput,
} from '@coreui/react';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const AllParcelOrder = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;
    const [filters, setFilters] = React.useState({ status: '', search: '', startDate: '', endDate: '' });

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/parcel/get_parcel_order');
            setOrders(data.data.reverse() || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        setLoading(true);
        try {
            const res = await axios.put(`https://www.appapi.olyox.com/api/v1/parcel/update_parcel_order_status/${id}`, { status: newStatus });
            toast.success(res?.data?.message || 'Status updated');
            fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (id) => {
        setLoading(true);
        try {
            const res = await axios.delete(`https://www.appapi.olyox.com/api/v1/parcel/delete_parcel_order/${id}`);
            toast.success(res?.data?.message || 'Order deleted');
            fetchOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Failed to delete order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteOrder(id);
            }
        });
    };

    const handleViewDetails = (order) => {
        console.log(order)
    //     Swal.fire({
    //         title: `Parcel Order Details`,
    //         html: `
    //     <div style="text-align: left;">
    //       <p><b>Customer Name:</b> ${order.customerId?.name || 'N/A'}</p>
    //       <p><b>Phone:</b> ${order.customerId?.number || 'N/A'}</p>
    //       <p><b>Pickup Address:</b> ${order.locations?.pickup?.address || 'N/A'}</p>
    //       <p><b>Dropoff Address:</b> ${order.locations?.dropoff?.address || 'N/A'}</p>
    //       <p><b>Apartment:</b> ${order.apartment || 'N/A'}</p>
    //       <p><b>Saved As:</b> ${order.savedAs || 'N/A'}</p>
    //       <p><b>Status:</b> ${order.status}</p>
    //       <p><b>Fare:</b> ₹${order.fares?.payableAmount || 0}</p>
    //       <p><b>Ride ID:</b> ${order.ride_id || 'N/A'}</p>
    //       <p><b>Booking Created At:</b> ${new Date(order.createdAt).toLocaleString()}</p>
    //       <p><b>Vehicle:</b> ${order.vehicle_id?.title || 'N/A'}</p>
    //       <p><b>Vehicle Info:</b> ${order.vehicle_id?.info || 'N/A'}</p>
    //     </div>
    //   `,
    //         width: 600,
    //         confirmButtonText: 'Close',
    //     });

    navigate(`/parcel-order-detail/${order._id}`)
    };

    React.useEffect(() => {
        fetchOrders();
    }, []);

    const handlePageChange = (page) => setCurrentPage(page);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredOrders = orders.filter((order) => {
        const { status, search, startDate, endDate } = filters;
        const bookingDate = dayjs(order.createdAt);
        const matchesStatus = status ? order.status === status : true;
        const matchesSearch = search
            ? order.customerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
            order.customerId?.number?.includes(search)
            : true;
        const matchesStartDate = startDate ? bookingDate.isAfter(dayjs(startDate).subtract(1, 'day')) : true;
        const matchesEndDate = endDate ? bookingDate.isBefore(dayjs(endDate).add(1, 'day')) : true;
        return matchesStatus && matchesSearch && matchesStartDate && matchesEndDate;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredOrders.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const heading = [
        'S.No',
        'Customer Name',
        'Customer Number',
        'Rider BH ID',
        'Rider Name',
        'Rider Number',
        'Pickup',
        'Dropoff',
        'Fare',
        'Status',
        'Change Status',
        'Action',
    ];

    return (
        <>
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
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="cancelled">Cancelled</option>
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
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : (
                <Table
                    heading="All Parcel Orders"
                    btnText=""
                    btnURL=""
                    tableHeading={heading}
                    tableContent={currentData.map((order, index) => (
                        <CTableRow key={order._id}>
                            <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                            <CTableDataCell>{order.customerId?.name || 'Guest'}</CTableDataCell>
                            <CTableDataCell>{order.customerId?.number || ''}</CTableDataCell>
                            <CTableDataCell>{order?.rider_id?.BH || ''}</CTableDataCell>
                            <CTableDataCell>{order.rider_id?.name || ''}</CTableDataCell>
                            <CTableDataCell>{order.rider_id?.phone || ''}</CTableDataCell>
                            <CTableDataCell>{order.locations?.pickup?.address || '-'}</CTableDataCell>
                            <CTableDataCell>{order.locations?.dropoff?.address || '-'}</CTableDataCell>
                            <CTableDataCell>₹{order.fares?.payableAmount || 0}</CTableDataCell>
                            <CTableDataCell>{order.status}</CTableDataCell>
                            <CTableDataCell>
                                <CFormSelect
                                    size="sm"
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="cancelled">Cancelled</option>
                                </CFormSelect>
                            </CTableDataCell>
                            <CTableDataCell>
                                <div className="action-parent" style={{ display: 'flex', gap: '5px' }}>
                                    <button
                                        className="btn btn-sm btn-info text-white"
                                        onClick={() => handleViewDetails(order)}
                                    >
                                        View Details
                                    </button>
                                    <div className="delete" onClick={() => confirmDelete(order._id)}>
                                        <i className="ri-delete-bin-fill"></i>
                                    </div>
                                </div>
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

export default AllParcelOrder;
