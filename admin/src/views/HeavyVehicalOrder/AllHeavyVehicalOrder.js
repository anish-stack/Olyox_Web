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

const AllHeavyVehicalOrder = () => {
    const [requests, setRequests] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    // Filter states
    const [filters, setFilters] = React.useState({
        search: '',
        status: '',
        startDate: '',
        endDate: '',
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleViewMessage = (message) => {
        Swal.fire({
            title: 'Message',
            text: message || 'No message available',
            icon: 'info',
            confirmButtonText: 'Close',
        });
    };

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/heavy/get-all-call-and-message-request');
            setRequests(data.data.reverse() || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Failed to load requests. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        setLoading(true);
        try {
            const res = await axios.put(`https://www.appapi.olyox.com/api/v1/heavy/toggle-call-and-message-request/${id}`, { status: newStatus });
            toast.success(res?.data?.message || 'Status updated');
            fetchRequests();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRequest = async (id) => {
        setLoading(true);
        try {
            const res = await axios.delete(`https://www.appapi.olyox.com/api/v1/heavy/delete-call-and-message-request/${id}`);
            toast.success(res?.data?.message || 'Request deleted');
            fetchRequests();
        } catch (error) {
            console.error('Error deleting request:', error);
            toast.error('Failed to delete request. Please try again.');
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
                handleDeleteRequest(id);
            }
        });
    };

    React.useEffect(() => {
        fetchRequests();
    }, []);

    const applyFilters = (data) => {
        return data.filter((item) => {
            const searchMatch =
                item?.senderId?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
                item?.senderId?.number?.toString().includes(filters.search);

            const statusMatch = filters.status ? item.status === filters.status : true;

            const createdAt = new Date(item.createdAt);
            const startDateMatch = filters.startDate ? createdAt >= new Date(filters.startDate) : true;
            const endDateMatch = filters.endDate ? createdAt <= new Date(filters.endDate) : true;

            return searchMatch && statusMatch && startDateMatch && endDateMatch;
        });
    };

    const filteredRequests = applyFilters(requests);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredRequests.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const handlePageChange = (page) => setCurrentPage(page);

    const heading = [
        'S.No',
        'Sender',
        'Sender Name',
        'Receiver',
        'Receiver Number',
        'Request Type',
        'Message',
        'Status',
        'Change Status',
        'Action',
    ];

    return (
        <>
            {/* Filters */}
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
                    heading="All Call and Message Requests"
                    btnText=""
                    btnURL=""
                    tableHeading={heading}
                    tableContent={currentData.map((item, index) => (
                        <CTableRow key={item._id}>
                            <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                            <CTableDataCell>{item.senderId ? item.senderId.name || 'N/A' : 'N/A'}</CTableDataCell>
                            <CTableDataCell>{item.senderId ? item.senderId.number || 'N/A' : 'N/A'}</CTableDataCell>
                            <CTableDataCell>{item.receiverId ? item.receiverId.name || 'N/A' : 'N/A'}</CTableDataCell>
                            <CTableDataCell>{item.receiverId ? item.receiverId.phone_number || 'N/A' : 'N/A'}</CTableDataCell>
                            <CTableDataCell>{item.requestType}</CTableDataCell>
                            <CTableDataCell>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleViewMessage(item.message)}
                                >
                                    View Message
                                </button>
                            </CTableDataCell>
                            <CTableDataCell>{item.status}</CTableDataCell>
                            <CTableDataCell>
                                <CFormSelect
                                    size="sm"
                                    value={item.status}
                                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                </CFormSelect>
                            </CTableDataCell>
                            <CTableDataCell>
                                <div className="action-parent">
                                    <div className="delete" onClick={() => confirmDelete(item._id)}>
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

export default AllHeavyVehicalOrder;
