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

const AllCabVendor = () => {
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const navigate = useNavigate();
    const itemsPerPage = 10;

    const fetchRiders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/rider');
            const allData = data.reverse();
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
            await axios.put(`https://www.appapi.olyox.com/api/v1/rider/updateRiderBlock/${riderId}`, {
                isBlockByAdmin: !currentStatus,
            });
            toast.success('Status updated successfully!');
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
      
        return matchesSearch && matchesCategory;
      });
      

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredRiders.reverse().slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredRiders.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (riderId) => {
        navigate(`/cab/vendor-detail/${riderId}`);
    };

    const handleRiderTiming = (riderId) => {
        navigate(`/cab/rider-time/${riderId}`);
    };

    const heading = ['S.No', 'BH Id', 'Rider Name', 'Rider Number', 'Vehicle Name', 'Vehicle Type', 'Total Rides', 'Rating', 'Rider Timing', 'Block', 'Actions'];

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
                                        onClick={() => handleDelete(rider._id)}
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

export default AllCabVendor;
