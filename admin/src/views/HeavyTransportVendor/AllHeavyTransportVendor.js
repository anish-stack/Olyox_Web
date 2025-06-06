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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Delete } from 'lucide-react';

const AllHeavyTransportVendor = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    // Get current page from URL params, default to 1
    const currentPage = parseInt(searchParams.get('page')) || 1;

    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const itemsPerPage = 7;
    const [verificationFilter, setVerificationFilter] = useState('all'); // 'all', 'verified', 'not_verified'

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/heavy/get_all_hv_vendor');
            const allData = data.data.reverse();
            // console.log("allData",allData)
            setVendors(Array.isArray(allData) ? allData : []);
        } catch (error) {
            console.error('Error fetching vendors:', error);
            toast.error('Failed to load vendors. Please try again.');
            setVendors([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (vendorId, currentStatus) => {
        setLoading(true);
        try {
            const updatedStatus = !currentStatus;

            await axios.put(`https://www.appapi.olyox.com/api/v1/heavy/update_hv_vendor_is_block_status/${vendorId}`, {
                is_blocked: updatedStatus,
            });

            if (updatedStatus) {
                toast.success('Vendor has been blocked.');
            } else {
                toast.success('Vendor has been unblocked.');
            }

            fetchVendors();
        } catch (error) {
            console.error('Error updating block status:', error);
            toast.error('Failed to update status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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

    const handleDelete = async (vendorId) => {
        try {
            const data = await axios.delete(`https://www.appapi.olyox.com/api/v1/heavy/heavy_vehicle_profile_delete/${vendorId}`);
            toast.success('Vendor deleted successfully');
            fetchVendors();
        } catch (error) {
            console.log("Internal Server Error: Failed to delete vendor.", error)
        }
    }

    useEffect(() => {
        fetchVendors();
    }, []);

    // Handle filter changes and reset to page 1
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        // Reset to page 1 when search changes
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', '1');
        setSearchParams(newSearchParams);
    };

    const handleVerificationFilterChange = (e) => {
        setVerificationFilter(e.target.value);
        // Reset to page 1 when filter changes
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', '1');
        setSearchParams(newSearchParams);
    };

    const filteredVendors = vendors.filter(vendor => {
        const searchQuery = searchTerm.toLowerCase();

        const matchesSearch = (
            vendor.name?.toLowerCase().includes(searchQuery) ||
            vendor.phone_number?.toLowerCase().includes(searchQuery) ||
            vendor.email?.toLowerCase().includes(searchQuery)
        );

        const matchesVerificationFilter =
            verificationFilter === 'all' ||
            (verificationFilter === 'verified' && vendor.isAlldocumentsVerified) ||
            (verificationFilter === 'not_verified' && !vendor.isAlldocumentsVerified);

        return matchesSearch && matchesVerificationFilter;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredVendors.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

    // Update URL when page changes
    const handlePageChange = (page) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', page.toString());
        setSearchParams(newSearchParams);
    };

    // Navigate with current page preserved
    const handleViewDetails = (vendorId) => {
        navigate(`/heavy/heavy-transport-vendor-detail/${vendorId}?returnPage=${currentPage}`);
    };

    const heading = ['S.No', 'BH ID', 'Name', 'Phone', 'Email', 'Vehicles', 'Service Areas', 'Call Timing', 'Registration Date', 'Document Verification', 'Blocked', 'Actions'];

    return (
        <>
            <div className="filter-container mb-3 d-flex gap-3">
                <CInputGroup className="w-50">
                    <CInputGroupText>Search</CInputGroupText>
                    <CFormInput
                        placeholder="Search by name, email, or phone"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </CInputGroup>

                <CInputGroup className="w-25">
                    <CInputGroupText>Document Status</CInputGroupText>
                    <select
                        className="form-select"
                        value={verificationFilter}
                        onChange={handleVerificationFilterChange}
                    >
                        <option value="all">All</option>
                        <option value="verified">Verified</option>
                        <option value="not_verified">Not Verified</option>
                    </select>
                </CInputGroup>
            </div>

            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : filteredVendors.length === 0 ? (
                <div className="no-data">
                    <p>No vendors found</p>
                </div>
            ) : (
                <Table
                    heading="Heavy Transport Vendors"
                    tableHeading={heading}
                    tableContent={
                        currentData.map((vendor, index) => (
                            <CTableRow key={vendor._id}>
                                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                                <CTableDataCell>{vendor.Bh_Id}</CTableDataCell>
                                <CTableDataCell>{vendor.name}</CTableDataCell>
                                <CTableDataCell>{vendor.phone_number}</CTableDataCell>
                                <CTableDataCell>{vendor.email}</CTableDataCell>
                                <CTableDataCell>
                                    {vendor.vehicle_info.length > 1
                                        ? `${vendor.vehicle_info[0].name}, ...`
                                        : vendor.vehicle_info[0]?.name || ''}

                                </CTableDataCell>
                                <CTableDataCell>
                                    {vendor.service_areas.length > 1
                                        ? `${vendor.service_areas[0].name}, ...`
                                        : vendor.service_areas[0]?.name || ''}

                                    {/* {vendor.service_areas.map(area => area.name).slice(0, 1).join('; ')} */}
                                </CTableDataCell>
                                <CTableDataCell>
                                    {vendor.call_timing?.start_time} - {vendor.call_timing?.end_time}
                                </CTableDataCell>
                                <CTableDataCell>
                                    <span className="text-muted small">
                                        {formatDate(vendor.createdAt)}
                                    </span>
                                </CTableDataCell>
                                {/* New Document Verification column */}
                                <CTableDataCell>
                                    {renderDocumentVerification(vendor.isAlldocumentsVerified)}
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CFormSwitch
                                        id={`blockSwitch-${vendor._id}`}
                                        label=""
                                        checked={vendor.is_blocked}
                                        onChange={() => handleStatusToggle(vendor._id, vendor.is_blocked)}
                                    />
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="info"
                                        size="sm"
                                        className="d-flex text-white align-items-center gap-2"
                                        onClick={() => handleViewDetails(vendor._id)}
                                    >
                                        <FaEye />
                                        View
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="danger"
                                        size="sm"
                                        className="d-flex text-white align-items-center gap-2"
                                        onClick={() => handleDelete(vendor._id)}
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

export default AllHeavyTransportVendor;