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
    CRow,
    CCol,
    CCard,
    CCardBody,
} from '@coreui/react';
import { FaEye, FaSearch } from 'react-icons/fa';
import { X } from 'lucide-react';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Delete } from 'lucide-react';

const AllTiffinVendor = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        bhid: '',
        name: '',
        phone: ''
    });
    const navigate = useNavigate();
    const itemsPerPage = 10;

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/tiffin/get_restaurant');
            console.log("data.data",data.data)
            setVendors(Array.isArray(data.data) ? data.data.reverse() : []);
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
        const updatedStatus = !currentStatus;

        await axios.put(`https://www.appapi.olyox.com/api/v1/tiffin/update_restaurant_status/${vendorId}`, {
            status: updatedStatus,
        });

        if (updatedStatus) {
            toast.success('Vendor has been activated successfully.');
        } else {
            toast.success('Vendor has been deactivated.');
        }

        fetchVendors();
    } catch (error) {
        console.error('Error updating status:', error);
        toast.error('Failed to update vendor status. Please try again.');
    } finally {
        setLoading(false);
    }
};


    const handleDelete = async (vendorId) => {
        try {
            const res = await axios.delete(`https://www.appapi.olyox.com/api/v1/tiffin/delete_tiffin_vendor/${vendorId}`);
            toast.success(res.data.message);
            fetchVendors();
        } catch (error) {
            console.log("Internal server error", error)
        }
    }

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const clearFilters = () => {
        setFilters({
            bhid: '',
            name: '',
            phone: ''
        });
        setCurrentPage(1);
    };

    // Filter vendors based on multiple criteria
    const filteredVendors = vendors.filter(vendor => {
        const matchesBHID = filters.bhid === '' || 
            vendor.restaurant_BHID?.toLowerCase().includes(filters.bhid.toLowerCase());
        
        const matchesName = filters.name === '' || 
            vendor.restaurant_name?.toLowerCase().includes(filters.name.toLowerCase());
        
        const matchesPhone = filters.phone === '' || 
            (vendor.restaurant_contact && 
             vendor.restaurant_contact.toString().includes(filters.phone));
        
        return matchesBHID && matchesName && matchesPhone;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredVendors.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (vendorId) => {
        navigate(`/tiffin/vendor-detail/${vendorId}`);
    };

    const handleViewTiffinPackage = (vendorId) => {
        navigate(`/tiffin/tiffin-listin/${vendorId}`);
    };

    const handleViewFoodListing = (vendorId) => {
        navigate(`/tiffin/tiffin-food-listin/${vendorId}`);
    };

    const heading = ['S.No', 'BH Id', 'Restaurant Name', 'Category', 'Location', 'Rating', 'Price Range', 'Status', 'View Tiffin Package', 'Food Listing', 'Actions', 'Delete'];

    return (
        <>
            {/* Enhanced Filter Section */}
            <CCard className="mb-4">
                <CCardBody>
                    <h5 className="mb-3">Search Filters</h5>
                    <CRow className="g-3">
                        <CCol md={3}>
                            <CInputGroup>
                                <CInputGroupText>
                                    BHID
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Search by BHID"
                                    name="bhid"
                                    value={filters.bhid}
                                    onChange={handleFilterChange}
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={3}>
                            <CInputGroup>
                                <CInputGroupText>
                                    Name
                                </CInputGroupText>
                                <CFormInput
                                    placeholder="Search by restaurant name"
                                    name="name"
                                    value={filters.name}
                                    onChange={handleFilterChange}
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={3}>
                            <CInputGroup>
                                <CInputGroupText>
                                    Phone
                                </CInputGroupText>
                                <CFormInput
                                    type="text"
                                    placeholder="Search by phone number"
                                    name="phone"
                                    value={filters.phone}
                                    onChange={handleFilterChange}
                                />
                            </CInputGroup>
                        </CCol>
                        <CCol md={3} className="d-flex align-items-center">
                            <CButton 
                                color="primary"
                                className="me-2"
                                onClick={fetchVendors}
                            >
                                <FaSearch className="me-1" /> Search
                            </CButton>
                            <CButton 
                                color="secondary"
                                variant="outline"
                                onClick={clearFilters}
                            >
                                <X size={16} className="me-1" /> Clear
                            </CButton>
                        </CCol>
                    </CRow>
                    <div className="mt-3 text-muted small">
                        Showing {filteredVendors.length} of {vendors.length} vendors
                    </div>
                </CCardBody>
            </CCard>

            {/* Loader or No Data */}
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : filteredVendors.length === 0 ? (
                <div className="no-data">
                    <p>No vendors available matching your search criteria</p>
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
                                <CTableDataCell>{vendor.restaurant_BHID}</CTableDataCell>
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
                                    <CFormSwitch
                                        id={`blockSwitch-${vendor._id}`}
                                        label=""
                                        checked={vendor.status}
                                        onChange={() => handleStatusToggle(vendor._id, vendor.status)}
                                    />
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="info"
                                        size="sm"
                                        className="d-flex align-items-center gap-2 text-white"
                                        onClick={() => handleViewTiffinPackage(vendor._id)}
                                    >
                                        <FaEye />
                                        View Details
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="info"
                                        size="sm"
                                        className="d-flex align-items-center gap-2 text-white"
                                        onClick={() => handleViewFoodListing(vendor._id)}
                                    >
                                        <FaEye />
                                        View Details
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="info"
                                        size="sm"
                                        className="d-flex align-items-center gap-2 text-white"
                                        onClick={() => handleViewDetails(vendor._id)}
                                    >
                                        <FaEye />
                                        View Details
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="danger"
                                        size="sm"
                                        className="d-flex align-items-center gap-2 text-white"
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