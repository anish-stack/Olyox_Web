import React, { useState, useEffect } from 'react';
import {
    CTableDataCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem,
    CButton,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
} from '@coreui/react';
import { FaEdit } from 'react-icons/fa';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function AllCarList() {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedRideId, setSelectedRideId] = useState(null);

    const navigate = useNavigate();
    const itemsPerPage = 10;

    const fetchRides = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/admin/getAllSuggestions');
            console.log(data?.data)
            setRides(Array.isArray(data.data) ? data.data.reverse() : []);
        } catch (error) {
            console.error('Error fetching rides:', error);
            toast.error('Failed to load rides suggestions. Please try again.');
            setRides([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRide = async () => {
        setLoading(true);
        try {
            await axios.delete(`https://www.appapi.olyox.com/api/v1/admin/deleteSuggestion/delete/${selectedRideId}`);
            toast.success('Ride deleted successfully!');
            fetchRides();
            setDeleteModal(false);
        } catch (error) {
            console.error('Error deleting ride:', error);
            toast.error('Failed to delete ride. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (rideId, currentStatus) => {
        setLoading(true);
        try {
            await axios.put(`https://www.appapi.olyox.com/api/v1/admin/updateSuggestionStatus/${rideId}`, {
                status: !currentStatus, // Toggle the status
            });
            toast.success('Status updated successfully!');
            fetchRides(); // Refresh the ride list after updating status
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update ride status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRides();
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = rides.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(rides.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const truncateText = (text, wordLimit) => {
        const words = text.split(' ');
        return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
    };

    const heading = ['S.No', 'Image', 'Name', 'Type', 'Description', 'Time', 'Price Range', 'Status','Add Brands' ,'Actions'];

    return (
        <>
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : (
                <Table
                    heading="Rides Suggestions"
                    btnText="Add Ride Suggestion"
                    btnURL="/cars/add-cars-list"
                    tableHeading={heading}
                    tableContent={
                        currentData.map((item, index) => (
                            <CTableRow key={item._id}>
                                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                                <CTableDataCell>
                                    {item.icons_image?.url ? (
                                        <img
                                            src={item.icons_image.url}
                                            alt={item.name}
                                            style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                                        />
                                    ) : (
                                        'No Image'
                                    )}
                                </CTableDataCell>
                                <CTableDataCell>{item.name}</CTableDataCell>
                                <CTableDataCell>{item.type}</CTableDataCell>
                                <CTableDataCell>{truncateText(item.description, 6)}</CTableDataCell>
                                <CTableDataCell>{item.time}</CTableDataCell>
                                <CTableDataCell>{item.priceRange}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color={item.status ? 'success' : 'secondary'}
                                        size="sm"
                                        onClick={() => handleStatusToggle(item._id, item.status)}
                                    >
                                        {item.status ? 'Active' : 'Inactive'}
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell>
                                      <CButton 
                                       onClick={() => navigate(`/cars/add-brands-list/${item._id}`)}
                                      color={'secondary'} >Add Brands</CButton>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="primary"
                                        size="sm"
                                        onClick={() => navigate(`/cars/edit-cars-list/${item._id}`)}
                                    >
                                        <FaEdit />
                                    </CButton>{' '}
                                    <CButton
                                        color="danger"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedRideId(item._id);
                                            setDeleteModal(true);
                                        }}
                                    >
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

            <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
                <CModalHeader>
                    <CModalTitle>Delete Ride Suggestion</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p>Are you sure you want to delete this ride suggestion?</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setDeleteModal(false)}>
                        Close
                    </CButton>
                    <CButton color="danger" onClick={handleDeleteRide}>
                        Delete
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default AllCarList;
