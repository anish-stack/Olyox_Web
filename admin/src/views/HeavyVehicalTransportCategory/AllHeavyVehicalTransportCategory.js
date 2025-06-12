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
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Delete, Edit } from 'lucide-react';
import Swal from 'sweetalert2';

const AllHeavyVehicalTransportCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const itemsPerPage = 7;

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/heavy/heavy-category');
            setCategories(data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories. Please try again.');
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (categoryId, currentStatus) => {
        setLoading(true);
        try {
            await axios.patch(`https://www.appapi.olyox.com/api/v1/heavy/heavy-category/${categoryId}/toggle-status`);
            toast.success(`Category ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
            fetchCategories();
        } catch (error) {
            console.error('Error updating category status:', error);
            toast.error('Failed to update status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (categoryId) => {
        try {
            await axios.delete(`https://www.appapi.olyox.com/api/v1/heavy/heavy-category/${categoryId}`);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            console.log("Internal Server Error: Failed to delete category.", error);
        }
    };

    const confirmDelete = (email) => {
            Swal.fire({
                title: 'Are you sure?',
                text: 'This action cannot be undone!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
            }).then((result) => {
                if (result.isConfirmed) {
                    handleDelete(email);
                }
            });
        };

    useEffect(() => {
        fetchCategories();
    }, []);

    const filteredCategories = categories.filter(category => {
        const searchQuery = searchTerm.toLowerCase();
        return (
            category.title?.toLowerCase().includes(searchQuery)
        );
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredCategories.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const heading = ['S.No', 'Category Title', 'Active', 'Edit'];

    return (
        <>
            <div className="filter-container mb-3">
                <CInputGroup>
                    <CInputGroupText>Search</CInputGroupText>
                    <CFormInput
                        placeholder="Search by title"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </CInputGroup>
            </div>

            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : (
                <Table
                    heading="Heavy Vehicle Categories"
                    tableHeading={heading}
                    btnText="Add Category"
                    btnURL="/add-heacy-transport-category"
                    tableContent={
                        currentData.map((category, index) => (
                            <CTableRow key={category._id}>
                                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                                <CTableDataCell>{category.title}</CTableDataCell>
                                <CTableDataCell>
                                    <CFormSwitch
                                        id={`activeSwitch-${category._id}`}
                                        label=""
                                        checked={category.active}
                                        onChange={() => handleStatusToggle(category._id, category.active)}
                                    />
                                </CTableDataCell>
                                
                                <CTableDataCell>
                                    <CButton
                                        color="info"
                                        size="sm"
                                        className="d-flex text-white align-items-center gap-2"
                                        onClick={() => navigate(`/edit-heacy-transport-category/${category._id}`)}
                                    >
                                        <Edit />
                                        Edit
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color="danger"
                                        size="sm"
                                        className="d-flex text-white align-items-center gap-2"
                                        onClick={() => confirmDelete(category._id)}
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

export default AllHeavyVehicalTransportCategory;
