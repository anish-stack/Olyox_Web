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

const AllHoteslVendor = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const itemsPerPage = 7;

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://demoapi.olyox.com/api/v1/hotels/get_all_hotel');
            const allData = data.data.reverse();
            setHotels(Array.isArray(allData) ? allData : []);
        } catch (error) {
            console.error('Error fetching hotels:', error);
            toast.error('Failed to load hotels. Please try again.');
            setHotels([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (hotelId, currentStatus) => {
        setLoading(true);
        try {
            await axios.put(`https://demoapi.olyox.com/api/v1/hotels/verify_hotel_documents/${hotelId}`, {
                isVerifiedTag: !currentStatus,
            });
            toast.success('Status updated successfully!');
            fetchHotels();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update hotel status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    // Filter hotels by hotel_name, hotel_address, or hotel_phone based on the searchTerm
    const filteredHotels = hotels.filter(hotel => {
        const searchQuery = searchTerm.toLowerCase();
        return (
            hotel.hotel_name?.toLowerCase().includes(searchQuery) ||
            hotel.hotel_address?.toLowerCase().includes(searchQuery) ||
            hotel.hotel_phone?.toLowerCase().includes(searchQuery)
        );
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredHotels.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (hotelId) => {
        navigate(`/hotel/vendor-detail/${hotelId}`);
    };

    const heading = ['S.No', 'Hotel Name', 'Zone', 'Address', 'Owner', 'Phone', 'Olyox Verified', 'Actions'];

    return (
        <>
            {/* Unified Search Input */}
            <div className="filter-container mb-3">
                <CInputGroup>
                    <CInputGroupText>Search</CInputGroupText>
                    <CFormInput
                        placeholder="Search by hotel name, address, or phone"
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
            ) : filteredHotels.length === 0 ? (
                <div className="no-data">
                    <p>No hotels available</p>
                </div>
            ) : (
                <Table
                    heading="Hotels List"
                    btnText=""
                    btnURL="/hotels/add-vendor"
                    tableHeading={heading}
                    tableContent={
                        currentData.map((hotel, index) => (
                            <CTableRow key={hotel._id}>
                                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                                <CTableDataCell>{hotel.hotel_name}</CTableDataCell>
                                <CTableDataCell>{hotel.hotel_zone}</CTableDataCell>
                                <CTableDataCell>{hotel.hotel_address}</CTableDataCell>
                                <CTableDataCell>{hotel.hotel_owner}</CTableDataCell>
                                <CTableDataCell>{hotel.hotel_phone}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color={hotel.isVerifiedTag ? 'success' : 'secondary'}
                                        size="sm"
                                        className="d-flex align-items-center gap-2"
                                        onClick={() => handleStatusToggle(hotel._id, hotel.isVerifiedTag)}
                                    >
                                        {hotel.isVerifiedTag ? <FaToggleOn /> : <FaToggleOff />}
                                        {hotel.isVerifiedTag ? 'Verified' : 'Unverified'}
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="info"
                                        size="sm"
                                        className="d-flex align-items-center gap-2"
                                        onClick={() => handleViewDetails(hotel._id)}
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

export default AllHoteslVendor;
