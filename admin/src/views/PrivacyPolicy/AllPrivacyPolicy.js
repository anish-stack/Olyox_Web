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
import { FaTrash } from 'react-icons/fa';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const AllPrivacyPolicy = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 7;

    const fetchPolicies = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://demoapi.olyox.com/api/v1/admin/policies');
            setPolicies(data.reverse() || []);
        } catch (error) {
            console.error('Error fetching policies:', error);
            toast.error('Failed to load policies. Please try again.');
            setPolicies([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, []);

    const confirmDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will delete the policy permanently.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                deletePolicy(id);
            }
        });
    };

    const deletePolicy = async (id) => {
        setLoading(true);
        try {
            const res = await axios.delete(`https://demoapi.olyox.com/api/v1/admin/policy/${id}`);
            toast.success(res?.data?.message || 'Policy deleted successfully.');
            fetchPolicies();
        } catch (error) {
            console.error('Error deleting policy:', error);
            toast.error(error?.response?.data?.message || 'Failed to delete policy.');
        } finally {
            setLoading(false);
        }
    };

    const filteredPolicies = policies.filter((policy) => {
        const search = searchTerm.toLowerCase();
        return (
            policy.title?.toLowerCase().includes(search) ||
            policy.category?.toLowerCase().includes(search) ||
            policy.description?.toLowerCase().includes(search)
        );
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredPolicies.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const heading = ['S.No', 'Title', 'Category', 'Description', 'Created At', 'Actions'];

    return (
        <>
            <div className="filter-container mb-3">
                <CInputGroup>
                    <CInputGroupText>Search</CInputGroupText>
                    <CFormInput
                        placeholder="Search by title, category or description"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </CInputGroup>
            </div>

            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : filteredPolicies.length === 0 ? (
                <div className="no-data">
                    <p>No policies available</p>
                </div>
            ) : (
                <Table
                    heading="Privacy Policies"
                    btnText="Add Privacy Policy"
                    btnURL="/add-privacy-policy"
                    tableHeading={heading}
                    tableContent={currentData.map((policy, index) => (
                        <CTableRow key={policy._id}>
                            <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                            <CTableDataCell>{policy.title}</CTableDataCell>
                            <CTableDataCell>{policy.category}</CTableDataCell>
                            <CTableDataCell>{policy.description.slice(0, 50)}...</CTableDataCell>
                            <CTableDataCell>{new Date(policy.createdAt).toLocaleDateString()}</CTableDataCell>
                            <CTableDataCell>
                            <div className="action-parent d-flex gap-2">
                                    <Link to={`/edit-privacy-policy/${policy._id}`} className="edit">
                                        <i className="ri-edit-line"></i>
                                    </Link>
                                    <div className="delete" onClick={() => confirmDelete(policy._id)}>
                                        <i className="ri-delete-bin-fill"></i>
                                    </div>
                                </div>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
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

export default AllPrivacyPolicy;
