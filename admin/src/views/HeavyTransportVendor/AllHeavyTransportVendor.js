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
} from '@coreui/react';
import { FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Delete } from 'lucide-react';

const AllHeavyTransportVendor = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const itemsPerPage = 7;

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/heavy/get_all_hv_vendor');
            const allData = data.data.reverse();
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


    const handleDelete = async(vendorId) => {
        try {
            const data = await axios.delete(`https://www.appapi.olyox.com/api/v1/heavy/heavy_vehicle_profile_delete/${vendorId}`);
            toast.success('Vendor deleted successfully');
        } catch (error) {
            console.log("Internal Server Error: Failed to delete vendor.",error)
        }
    }

    useEffect(() => {
        fetchVendors();
    }, []);

    const filteredVendors = vendors.filter(vendor => {
        const searchQuery = searchTerm.toLowerCase();
        return (
            vendor.name?.toLowerCase().includes(searchQuery) ||
            vendor.phone_number?.toLowerCase().includes(searchQuery) ||
            vendor.email?.toLowerCase().includes(searchQuery)
        );
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredVendors.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const heading = ['S.No', 'BH ID', 'Name', 'Phone', 'Email', 'Vehicles', 'Service Areas', 'Call Timing', 'Blocked', 'Actions'];

    return (
        <>
            <div className="filter-container mb-3">
                <CInputGroup>
                    <CInputGroupText>Search</CInputGroupText>
                    <CFormInput
                        placeholder="Search by name, email, or phone"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
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
                                        onClick={() => navigate(`/heavy/heavy-transport-vendor-detail/${vendor._id}`)}
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

export default AllHeavyTransportVendor;
