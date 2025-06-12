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
    CFormSwitch,
    CBadge,
} from '@coreui/react';
import { FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import Table from '../../components/Table/Table';

import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Delete } from 'lucide-react';
import Swal from 'sweetalert2';

const AllCabVendor = () => {
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [documentVerifyFilter, setDocumentVerifyFilter] = useState('all');

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Get current page from URL params, default to 1
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const itemsPerPage = 10;

    const fetchRiders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/rider');
            const allData = data;
            setRiders(Array.isArray(allData) ? allData : []);
        } catch (error) {
            console.error('Error fetching riders:', error);
            toast.error('Failed to load riders. Please try again.');
            setRiders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (riderId, currentStatus) => {
        setLoading(true);
        try {
            const updatedStatus = !currentStatus;

            await axios.put(`https://www.appapi.olyox.com/api/v1/rider/updateRiderBlock/${riderId}`, {
                isBlockByAdmin: updatedStatus,
            });

            if (updatedStatus) {
                toast.success('Rider has been blocked by admin.');
            } else {
                toast.success('Rider has been unblocked.');
            }

            fetchRiders();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update rider status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (vendorId) => {
        try {
            const data = await axios.delete(`https://www.appapi.olyox.com/api/v1/rider/delete_rider_vendor/${vendorId}`);
            toast.success(data.data.message);
            fetchRiders();
        } catch (error) {
            console.log("Internal server error", error)
        }
    }

    const confirmDelete = (email) => {
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
                    handleDelete(email);
                }
            });
        };

    useEffect(() => {
        fetchRiders();
    }, []);

    // Filter riders by name or phone based on the searchTerm
    const filteredRiders = riders.filter(rider => {
        const searchQuery = searchTerm.toLowerCase();
        const matchesSearch =
            rider.name?.toLowerCase().includes(searchQuery) ||
            rider.phone?.toLowerCase().includes(searchQuery);

        const matchesCategory =
            categoryFilter === 'all' ||
            (categoryFilter === 'parcel' && rider.category === 'parcel') ||
            (categoryFilter === 'non-parcel' && rider.category !== 'parcel');

        const matchesDocumentStatus =
            documentVerifyFilter === 'all' ||
            (documentVerifyFilter === 'verified' && rider.DocumentVerify === true) ||
            (documentVerifyFilter === 'not-verified' && rider.DocumentVerify === false);

        return matchesSearch && matchesCategory && matchesDocumentStatus;
    });

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format document verification status
    const renderDocumentVerification = (isVerified) => {
        return (
            <CBadge
                color={isVerified ? 'success' : 'danger'}
                style={{
                    backgroundColor: isVerified ? '#28a745' : '#dc3545',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '12px'
                }}
            >
                {isVerified ? 'Verified' : 'Not Verified'}
            </CBadge>
        );
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredRiders.reverse().slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredRiders.length / itemsPerPage);

    // Update URL when page changes
    const handlePageChange = (page) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', page.toString());
        setSearchParams(newSearchParams);
    };

    // Navigate with current page preserved
    const handleViewDetails = (riderId) => {
        navigate(`/cab/vendor-detail/${riderId}?returnPage=${currentPage}`);
    };

    const handleRiderTiming = (riderId) => {
        navigate(`/cab/rider-time/${riderId}?returnPage=${currentPage}`);
    };

    // Reset to page 1 when filters change
    useEffect(() => {
        if (currentPage > 1 && (searchTerm || categoryFilter !== 'all' || documentVerifyFilter !== 'all')) {
            const newSearchParams = new URLSearchParams();
            newSearchParams.set('page', '1');
            setSearchParams(newSearchParams);
        }
    }, [searchTerm, categoryFilter, documentVerifyFilter]);

    const heading = ['S.No', 'BH Id', 'Rider Name', 'Rider Number', 'Vehicle Name', 'Vehicle Type', 'Total Rides', 'Rating', 'Registration Date', 'Document Verification', 'Rider Timing', 'Block', 'Actions'];

    return (
        <>
            {/* Filter Section - Search input */}
            <div className="d-flex gap-3 mb-3">
                <CInputGroup style={{ maxWidth: '400px' }}>
                    <CInputGroupText>Search</CInputGroupText>
                    <CFormInput
                        placeholder="Search by rider name or phone"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </CInputGroup>

                <select
                    className="form-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{ maxWidth: '200px' }}
                >
                    <option value="all">All</option>
                    <option value="parcel">Parcel</option>
                    <option value="non-parcel">Without Parcel</option>
                </select>
                <select
                    className="form-select"
                    value={documentVerifyFilter}
                    onChange={(e) => setDocumentVerifyFilter(e.target.value)}
                    style={{ maxWidth: '200px' }}
                >
                    <option value="all">All Documents</option>
                    <option value="verified">Verified</option>
                    <option value="not-verified">Not Verified</option>
                </select>
            </div>

            {/* Loader or No Data */}
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : filteredRiders.length === 0 ? (
                <div className="no-data">
                    <p>No riders available</p>
                </div>
            ) : (
                <Table
                    heading="Riders"
                    btnText=""
                    btnURL="/add-rider"
                    tableHeading={heading}
                    tableContent={
                        currentData.map((rider, index) => (
                            <CTableRow key={rider._id}>
                                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                                <CTableDataCell>{rider.BH}</CTableDataCell>
                                <CTableDataCell>{rider.name}</CTableDataCell>
                                <CTableDataCell>{rider.phone}</CTableDataCell>
                                <CTableDataCell>{rider.rideVehicleInfo.vehicleName}</CTableDataCell>
                                <CTableDataCell>{rider.rideVehicleInfo.vehicleType}</CTableDataCell>
                                <CTableDataCell>{rider.TotalRides}</CTableDataCell>
                                <CTableDataCell>
                                    <div className="d-flex align-items-center">
                                        <span className="me-1">{rider.Ratings}</span>
                                        <span className="text-warning">★</span>
                                    </div>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <span className="text-muted small">
                                        {formatDate(rider.createdAt) || 'N/A'}
                                    </span>
                                </CTableDataCell>
                                <CTableDataCell>
                                    {renderDocumentVerification(rider.DocumentVerify)}
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="info"
                                        size="sm"
                                        className="d-flex text-white align-items-center gap-2"
                                        onClick={() => handleRiderTiming(rider._id)}
                                    >
                                        <FaEye />
                                        View Details
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CFormSwitch
                                        id={`blockSwitch-${rider._id}`}
                                        label=""
                                        checked={rider.isBlockByAdmin}
                                        onChange={() => handleStatusToggle(rider._id, rider.isBlockByAdmin)}
                                    />
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="info"
                                        size="sm"
                                        className="d-flex text-white align-items-center gap-2"
                                        onClick={() => handleViewDetails(rider._id)}
                                    >
                                        <FaEye />
                                        View Details
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="danger"
                                        size="sm"
                                        className="d-flex text-white align-items-center gap-2"
                                        onClick={() => confirmDelete(rider._id)}
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

                            {(() => {
                                const pageItems = [];
                                const visiblePages = 4;
                                let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
                                let endPage = startPage + visiblePages - 1;

                                if (endPage > totalPages) {
                                    endPage = totalPages;
                                    startPage = Math.max(1, endPage - visiblePages + 1);
                                }

                                for (let i = startPage; i <= endPage; i++) {
                                    pageItems.push(
                                        <CPaginationItem
                                            key={i}
                                            active={i === currentPage}
                                            onClick={() => handlePageChange(i)}
                                        >
                                            {i}
                                        </CPaginationItem>
                                    );
                                }

                                return pageItems;
                            })()}

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

export default AllCabVendor;