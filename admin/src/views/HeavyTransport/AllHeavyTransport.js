import React, { useState, useEffect } from 'react';
import {
    CTableDataCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CButton
} from '@coreui/react';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AllHeavyTransport = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;
    const navigate = useNavigate();

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://www.appapi.olyox.com/api/v1/admin/get-heavy');
            setVehicles(Array.isArray(data.data) ? data.data.reverse() : []);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            toast.error('Failed to load vehicles. Please try again.');
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://www.appapi.olyox.com/api/v1/admin/delete-heavy/${id}`);
            toast.success('Vehicle deleted successfully');
            fetchVehicles();
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            toast.error('Failed to delete vehicle. Please try again.');
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const filteredVehicles = vehicles.filter(vehicle =>
        vehicle.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredVehicles.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const heading = ['S.No', 'Image', 'Title', 'Category', 'Background Colour', 'Active Status', 'Actions'];

    return (
        <>
            <div className="filter-container mb-3">
                <CInputGroup>
                    <CInputGroupText>Search</CInputGroupText>
                    <CFormInput
                        placeholder="Search by Title or Category"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </CInputGroup>
            </div>
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : filteredVehicles.length === 0 ? (
                <div className="no-data">
                    <p>No vehicles available</p>
                </div>
            ) : (
                <Table
                    heading="Heavy Transport Vehicles"
                    btnText="Add Heavy Transport Vehicle"
                    btnURL="/add-heacy-transport-option"
                    tableHeading={heading}
                    tableContent={
                        currentData.map((vehicle, index) => (
                            <CTableRow key={vehicle._id} style={{ backgroundColor: vehicle.backgroundColour }}>
                                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                                <CTableDataCell>
                                    <img src={vehicle.image.url} alt={vehicle.title} width={50} height={50} />
                                </CTableDataCell>
                                <CTableDataCell>{vehicle.title || 'N/A'}</CTableDataCell>
                                <CTableDataCell>{vehicle.category || 'N/A'}</CTableDataCell>
                                <CTableDataCell>
                                    <div style={{ backgroundColor: vehicle.backgroundColour, padding: '5px', borderRadius: '5px', textAlign: 'center', color: '#fff' }}>
                                        {vehicle.backgroundColour}
                                    </div>
                                </CTableDataCell>
                                <CTableDataCell>{vehicle.active ? 'Active' : 'Inactive'}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="danger" size="sm" onClick={() => handleDelete(vehicle._id)}>Delete</CButton>
                                    <CButton color="primary" size="sm" onClick={() => navigate(`/edit-heacy-transport-option/${vehicle._id}`)} className="ms-2">Update</CButton>
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

export default AllHeavyTransport;
