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
import { FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AllParcelVendor = () => {
    const [vendors, setVendors] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(''); // For filtering
    const navigate = useNavigate();
    const itemsPerPage = 10;

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/parcel/get_all_parcel_user');
            setVendors(Array.isArray(data.data) ? data.data : []);
        } catch (error) {
            console.error('Error fetching vendors:', error);
            toast.error('Failed to load parcel vendors. Please try again.');
            setVendors([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (vendorId, currentStatus) => {
        setLoading(true);
        try {
            await axios.put(`https://www.appapi.olyox.com/api/v1/parcel/update_parcel_is_block_status/${vendorId}`, {
                isBlockByAdmin: !currentStatus,
            });
            toast.success('Status updated successfully!');
            fetchVendors();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update vendor status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    // Filter vendors by name or phone based on the searchTerm
    const filteredVendors = vendors.filter(vendor => {
        const searchQuery = searchTerm.toLowerCase();
        return (
            vendor.name?.toLowerCase().includes(searchQuery) ||
            vendor.phone?.toLowerCase().includes(searchQuery)
        );
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredVendors.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (vendorId) => {
        navigate(`/parcel/vendor-detail/${vendorId}`);
    };

    const heading = ['S.No', 'Name', 'Phone', 'Bike Make', 'Bike Model', 'License Plate', 'Documents Verified', 'Block', 'Actions'];

    return (
        <>
            {/* Filter Section - Search input */}
            <div className="filter-container mb-3">
                <CInputGroup>
                    <CInputGroupText>Search</CInputGroupText>
                    <CFormInput
                        placeholder="Search by name or phone"
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
            ) : filteredVendors.length === 0 ? (
                <div className="no-data">
                    <p>No vendors available</p>
                </div>
            ) : (
                <Table
                    heading="Parcel Vendors"
                    btnText=""
                    btnURL="/parcel/add-vendor"
                    tableHeading={heading}
                    tableContent={
                        currentData.map((vendor, index) => (
                            <CTableRow key={vendor._id}>
                                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                                <CTableDataCell>{vendor.name}</CTableDataCell>
                                <CTableDataCell>{vendor.phone}</CTableDataCell>
                                <CTableDataCell>{vendor.bikeDetails.make}</CTableDataCell>
                                <CTableDataCell>{vendor.bikeDetails.model}</CTableDataCell>
                                <CTableDataCell>{vendor.bikeDetails.licensePlate}</CTableDataCell>
                                <CTableDataCell>{vendor.DocumentVerify ? 'Yes' : 'No'}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color={vendor.isBlockByAdmin ? 'secondary' : 'success'}
                                        size="sm"
                                        className="d-flex align-items-center gap-2"
                                        onClick={() => handleStatusToggle(vendor._id, vendor.isBlockByAdmin)}
                                    >
                                        {vendor.isBlockByAdmin ? <FaToggleOff /> : <FaToggleOn />}
                                        {vendor.isBlockByAdmin ? 'Blocked' : 'Active'}
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="info"
                                        size="sm"
                                        className="d-flex align-items-center gap-2"
                                        onClick={() => handleViewDetails(vendor._id)}
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

export default AllParcelVendor;
