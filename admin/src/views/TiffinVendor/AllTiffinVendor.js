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

const AllTiffinVendor = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const itemsPerPage = 10;

    const fetchVendors = async () => {
        setLoading(true);
        try {
            
            const { data } = await axios.get('https://demoapi.olyox.com/api/v1/tiffin/get_restaurant');
            setVendors(Array.isArray(data.data) ? data.data : []);
        } catch (error) {
            console.error('Error fetching vendors:', error);
            toast.error('Failed to load tiffin vendors. Please try again.');
            setVendors([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (vendorId, currentStatus) => {
        setLoading(true);
        try {
            await axios.put(`https://demoapi.olyox.com/api/v1/tiffin/update_restaurant_status/${vendorId}`, {
                status: !currentStatus,
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

    // Filter vendors by restaurant name
    const filteredVendors = vendors.filter(vendor =>
        vendor.restaurant_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredVendors.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (vendorId) => {
        navigate(`/tiffin/vendor-detail/${vendorId}`);
    };

    const heading = ['S.No', 'Restaurant Name', 'Category', 'Location', 'Rating', 'Price Range', 'Status', 'Actions'];

    return (
        <>
            {/* Filter Input */}
            <div className="filter-container mb-3">
                <CInputGroup>
                    <CInputGroupText>Search by Name</CInputGroupText>
                    <CFormInput
                        placeholder="Search by restaurant name"
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
                    heading="Tiffin Vendors"
                    btnText=""
                    btnURL="/tiffin/add-vendor"
                    tableHeading={heading}
                    tableContent={
                        currentData.map((vendor, index) => (
                            <CTableRow key={vendor._id}>
                                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                                <CTableDataCell>{vendor.restaurant_name}</CTableDataCell>
                                <CTableDataCell>{vendor.restaurant_category}</CTableDataCell>
                                <CTableDataCell>
                                    {vendor.restaurant_address.city}, {vendor.restaurant_address.state}
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div className="d-flex align-items-center">
                                        <span className="me-1">{vendor.rating}</span>
                                        <span className="text-warning">★</span>
                                    </div>
                                </CTableDataCell>
                                <CTableDataCell>
                                    ₹{vendor.minPrice} - ₹{vendor.priceForTwoPerson}
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color={vendor.status ? 'success' : 'secondary'}
                                        size="sm"
                                        className="d-flex align-items-center gap-2"
                                        onClick={() => handleStatusToggle(vendor._id, vendor.status)}
                                    >
                                        {vendor.status ? <FaToggleOn /> : <FaToggleOff />}
                                        {vendor.status ? 'Active' : 'Inactive'}
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

export default AllTiffinVendor;
