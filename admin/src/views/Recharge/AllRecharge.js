import React, { useState, useEffect } from 'react';
import {
    CTableDataCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem,
    CFormSwitch,
    CButton,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CFormTextarea,
} from '@coreui/react';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';

function AllRecharge() {
    const [recharges, setRecharges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [cancelModal, setCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [selectedRechargeId, setSelectedRechargeId] = useState(null);
    const itemsPerPage = 10;
    

    const fetchRecharges = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://www.webapi.olyox.com/api/v1/get-all-recharge');
            setRecharges(data.data || []);
        } catch (error) {
            console.error('Error fetching recharges:', error);
            toast.error('Failed to load recharges. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const togglePaymentApproval = async (id) => {
        setLoading(true);
        try {
            // Call the getApprovedRecharge endpoint
            const res = await axios.get(`https://www.webapi.olyox.com/api/v1/approve_recharge?_id=${id}`);
            toast.success(res?.data?.message);

            // Refresh the recharge list after updating
            fetchRecharges();
        } catch (error) {
            console.error('Error approving payment:', error);
            toast.error(
                error?.response?.data?.message ||
                'Failed to approve payment. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRecharge = async () => {
        if (!cancelReason) {
            toast.error('Please provide a reason for cancellation.');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.put(`https://www.webapi.olyox.com/api/v1/cancel_recharge?_id=${selectedRechargeId}`, {
                cancelReason,
                isCancelPayment: true,
            });
            toast.success(res?.data?.message);
            fetchRecharges();
            setCancelModal(false);
            setCancelReason('');
            setSelectedRechargeId(null);
        } catch (error) {
            console.error('Error cancelling recharge:', error);
            toast.error(
                error?.response?.data?.message ||
                'Failed to cancel the recharge. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecharges();
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = recharges.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(recharges.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const heading = [
        'S.No',
        'BH ID',
        'MemberShip Name',
        'Vendor Name',
        'End Date',
        'Amount',
        'Transaction No.',
        'Payment Approved',
        'Cancel',
        'Created At',
        'Updated At',
    ];

    return (
        <>
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : recharges.length === 0 ? (
                <div className="no-data">
                    <p>No data available</p>
                </div>
            ) : (
                <Table
                    heading="All Recharges"
                    tableHeading={heading}
                    tableContent={
                        currentData.map((item, index) => (
                            <CTableRow key={item._id}>
                                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                                <CTableDataCell>{item?.vendor_id?.myReferral}</CTableDataCell>
                                <CTableDataCell>{item?.member_id?.title}</CTableDataCell>
                                <CTableDataCell>
                                    <a href={`#/vendor/vendor_detail/${item?.vendor_id?._id}`}>
                                        {item?.vendor_id?.name}
                                    </a>
                                </CTableDataCell>
                                <CTableDataCell>{new Date(item.end_date).toLocaleDateString()}</CTableDataCell>
                                <CTableDataCell>{item.amount}</CTableDataCell>
                                <CTableDataCell>{item.trn_no}</CTableDataCell>
                                <CTableDataCell>
                                    <CFormSwitch
                                        id={`formSwitch-${item._id}`}
                                        checked={item.payment_approved}
                                        disabled={item.isCancelPayment}
                                        onChange={() => togglePaymentApproval(item._id)}
                                    />
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CButton
                                        style={{ color: 'white' }}
                                        color="danger"
                                        size="sm"
                                        disabled={item.payment_approved}
                                        onClick={() => {
                                            setSelectedRechargeId(item._id);
                                            setCancelModal(true);
                                        }}
                                    >
                                        Cancel
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell>{new Date(item.createdAt).toLocaleString()}</CTableDataCell>
                                <CTableDataCell>{new Date(item.updatedAt).toLocaleString()}</CTableDataCell>
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

            <CModal visible={cancelModal} onClose={() => setCancelModal(false)}>
                <CModalHeader>
                    <CModalTitle>Cancel Recharge</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormTextarea
                        rows={4}
                        placeholder="Enter cancellation reason..."
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setCancelModal(false)}>
                        Close
                    </CButton>
                    <CButton color="danger" onClick={handleCancelRecharge}>
                        Submit
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
}

export default AllRecharge;
