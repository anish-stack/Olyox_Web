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
    CBadge,
} from '@coreui/react';
import { FaEye, FaSearch } from 'react-icons/fa';
import { X } from 'lucide-react';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Delete } from 'lucide-react';

const AllTiffinVendor = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Get current page from URL params, default to 1
    const currentPage = parseInt(searchParams.get('page')) || 1;
    
    const [filters, setFilters] = useState({
        bhid: '',
        name: '',
        phone: '',
        documentVerify: '' // new field for filter
    });

    
    const navigate = useNavigate();
    const itemsPerPage = 10;

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/tiffin/get_restaurant');
            console.log("data.data", data.data)
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

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        // Reset to page 1 when filters change
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', '1');
        setSearchParams(newSearchParams);
    };

    const clearFilters = () => {
        setFilters({
            bhid: '',
            name: '',
            phone: '',
            documentVerify: ''
        });
        // Reset to page 1 when clearing filters
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', '1');
        setSearchParams(newSearchParams);
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

        const matchesDocumentVerify =
            filters.documentVerify === '' ||
            String(vendor.documentVerify) === filters.documentVerify;

        return matchesBHID && matchesName && matchesPhone && matchesDocumentVerify;
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
        navigate(`/tiffin/vendor-detail/${vendorId}?returnPage=${currentPage}`);
    };

    const handleViewTiffinPackage = (vendorId) => {
        navigate(`/tiffin/tiffin-listin/${vendorId}?returnPage=${currentPage}`);
    };

    const handleViewFoodListing = (vendorId) => {
        navigate(`/tiffin/tiffin-food-listin/${vendorId}?returnPage=${currentPage}`);
    };

    // Updated heading array to include new columns
    const heading = ['S.No', 'BH Id', 'Restaurant Name', 'Category', 'Location', 'Rating', 'Price Range', 'Registration Date', 'Document Verify', 'Status', 'View Tiffin Package', 'Food Listing', 'Actions', 'Delete'];

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
                                    Document
                                </CInputGroupText>
                                <select
                                    className="form-select"
                                    name="documentVerify"
                                    value={filters.documentVerify}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All</option>
                                    <option value="true">Verified</option>
                                    <option value="false">Not Verified</option>
                                </select>
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
                                {/* New Registration Date column */}
                                <CTableDataCell>
                                    <span className="text-muted small">
                                        {formatDate(vendor.createdAt)}
                                    </span>
                                </CTableDataCell>
                                {/* New Document Verification column */}
                                <CTableDataCell>
                                    {renderDocumentVerification(vendor.documentVerify)}
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

export default AllTiffinVendor;