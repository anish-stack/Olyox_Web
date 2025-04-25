import React from 'react';
import {
    CTableDataCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem,
    CNavLink,
    CBadge,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CFormSelect,
    CFormLabel,
    CFormInput,
    CButton,
} from '@coreui/react';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const AllLoginBugReport = () => {
    const [bugReports, setBugReports] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [selectedReport, setSelectedReport] = React.useState(null);
    const [status, setStatus] = React.useState('');
    const [bugFix, setBugFix] = React.useState('');
    const [visible, setVisible] = React.useState(false);

    const itemsPerPage = 10;

    const fetchBugReports = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/admin/reports');
            setBugReports(data.data.reverse() || []);
        } catch (error) {
            toast.error('Failed to load bug reports.');
        } finally {
            setLoading(false);
        }
    };

    const deleteBugReport = async (id) => {
        setLoading(true);
        try {
            const res = await axios.delete(`https://www.appapi.olyox.com/api/v1/admin/report/${id}`);
            toast.success(res?.data?.message || 'Bug report deleted.');
            fetchBugReports();
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Internal server error');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => {
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
                deleteBugReport(id);
            }
        });
    };

    const openHandleModal = (report) => {
        setSelectedReport(report);
        setStatus(report.adminHandle?.status || '');
        setBugFix(report.adminHandle?.bugFix || '');
        setVisible(true);
    };

    const handleUpdate = async () => {
        if (!selectedReport) return;
        try {
            const { data } = await axios.put(`https://www.appapi.olyox.com/api/v1/admin/report/${selectedReport._id}`, {
                status,
                bugFix,
            });
            toast.success(data.message);
            setVisible(false);
            fetchBugReports();
        } catch (error) {
            toast.error('Failed to update report');
        }
    };

    React.useEffect(() => {
        fetchBugReports();
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = bugReports.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(bugReports.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const heading = ['S.No', 'Name', 'Message', 'Number', 'Status', 'Screenshot', 'Action'];

    return (
        <>
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : (
                <Table
                    heading="All Login Bug Reports"
                    btnText=""
                    btnURL=""
                    tableHeading={heading}
                    tableContent={currentData.map((item, index) => (
                        <CTableRow key={item._id}>
                            <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                            <CTableDataCell>{item.name}</CTableDataCell>
                            <CTableDataCell>{item.message}</CTableDataCell>
                            <CTableDataCell>{item.number}</CTableDataCell>
                            <CTableDataCell>
                                <CBadge color={
                                    item.adminHandle?.status === 'Resolved' ? 'success' :
                                    item.adminHandle?.status === 'In Progress' ? 'warning' :
                                    'secondary'
                                }>
                                    {item.adminHandle?.status || 'Pending'}
                                </CBadge>
                            </CTableDataCell>
                            <CTableDataCell>
                                {item.screenshot ? (
                                    <a href={item.screenshot} target="_blank" rel="noopener noreferrer">View</a>
                                ) : (
                                    'N/A'
                                )}
                            </CTableDataCell>
                            <CTableDataCell>
                                <div className="action-parent d-flex gap-2">
                                    <div className="edit" onClick={() => openHandleModal(item)}>
                                        <i className="ri-edit-line"></i>
                                    </div>
                                    <div className="delete" onClick={() => confirmDelete(item._id)}>
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

            {/* Modal */}
            <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>Handle Bug Report</CModalHeader>
                <CModalBody>
                    <div className="mb-3">
                        <CFormLabel>Status</CFormLabel>
                        <CFormSelect value={status} onChange={(e) => setStatus(e.target.value)} required>
                            <option value="">Select status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </CFormSelect>
                    </div>
                    <div className="mb-3">
                        <CFormLabel>Bug Fix Notes</CFormLabel>
                        <CFormInput
                            type="text"
                            value={bugFix}
                            onChange={(e) => setBugFix(e.target.value)}
                            placeholder="Describe the fix (if any)"
                        />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Cancel
                    </CButton>
                    <CButton color="primary" onClick={handleUpdate}>
                        Update Report
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};


export default AllLoginBugReport;
