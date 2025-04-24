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
    CButton,
    CBadge
} from '@coreui/react';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CancelReason = () => {
    const [reasons, setReasons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;
    const navigate = useNavigate();

    const fetchCancelReasons = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://demoapi.olyox.com/api/v1/admin/get-All-Cancel-Reasons-Admin');
            setReasons(Array.isArray(data.data) ? data.data.reverse() : []);
        } catch (error) {
            console.error('Error fetching cancel reasons:', error);
            toast.error('Failed to load cancel reasons. Please try again.');
            setReasons([]);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            const { data } = await axios.put(`https://demoapi.olyox.com/api/v1/admin/toggle-cancel-reasons/${id}`, { status: newStatus });
            toast.success(data.message);
            fetchCancelReasons();
        } catch (error) {
            console.log('Error updating status:', error);
            toast.error('Failed to update status. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://demoapi.olyox.com/api/v1/admin/cancel-reasons/${id}`);
            toast.success('Cancel reason deleted successfully');
            fetchCancelReasons();
        } catch (error) {
            console.error('Error deleting cancel reason:', error);
            toast.error('Failed to delete cancel reason. Please try again.');
        }
    };

    useEffect(() => {
        fetchCancelReasons();
    }, []);

    const filteredReasons = reasons.filter(reason =>
        reason.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reason.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredReasons.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredReasons.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const heading = ['S.No', 'Name', 'Description', 'Status', 'Actions'];

    return (
        <>
            <div className="filter-container mb-3">
                <CInputGroup>
                    <CInputGroupText>Search</CInputGroupText>
                    <CFormInput
                        placeholder="Search by Name or Description"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </CInputGroup>
            </div>
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : filteredReasons.length === 0 ? (
                <div className="no-data">
                    <p>No cancel reasons available</p>
                </div>
            ) : (
                <Table
                    heading="Cancel Reasons"
                    tableHeading={heading}
                    btnText="Add Cancel Reason"
                    btnURL="/add-cancel-reason"
                    tableContent={
                        currentData.map((reason, index) => (
                            <CTableRow key={reason._id}>
                                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                                <CTableDataCell>{reason.name || 'N/A'}</CTableDataCell>
                                <CTableDataCell>{reason.description || 'N/A'}</CTableDataCell>
                                <CTableDataCell>
                                    <CBadge color={reason.status === 'active' ? 'success' : 'secondary'}>
                                        {reason.status}
                                    </CBadge>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        color={reason.status === 'active' ? 'danger' : 'success'}
                                        size="sm"
                                        onClick={() => handleToggleStatus(reason._id, reason.status)}
                                    >
                                        {reason.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </CButton>
                                    <CButton
                                        color="warning"
                                        size="sm"
                                        className="ms-2"
                                        onClick={() => navigate(`/edit-cancel-reason/${reason._id}`)}
                                    >
                                        Edit
                                    </CButton>
                                    <CButton
                                        color="danger"
                                        size="sm"
                                        className="ms-2"
                                        onClick={() => handleDelete(reason._id)}
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
        </>
    );
};

export default CancelReason;
