import React, { useState, useEffect } from 'react';
import {
    CTableDataCell,
    CTableRow,
    CSpinner,
    CButton,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CFormTextarea,
    CFormInput,
} from '@coreui/react';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';

function AllWithdraw() {
    const [withdrawals, setWithdrawals] = useState([]); // Renamed from recharges to withdrawals
    const [loading, setLoading] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [selectedWithdrawalId, setSelectedWithdrawalId] = useState(null); // Renamed
    const [approveModal, setApproveModal] = useState(false);
    const [trnNo, setTrnNo] = useState('');
    const [paymentTime, setPaymentTime] = useState('');
    const [detailModal, setDetailModal] = useState(false);
    const [methodDetails, setMethodDetails] = useState(null);
    

    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            // Change to the withdrawal endpoint
            const { data } = await axios.get('api/v1/withdrawals');

            setWithdrawals(data.withdrawals || []); // Ensure you handle the correct data
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
            toast.error('Failed to load withdrawals. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveWithdrawal = async () => {
        if (!trnNo || !paymentTime) {
            toast.error('Please provide both transaction number and time of payment.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
            const res = await axios.put(
                `api/v1/approve-withdrawal/${selectedWithdrawalId}`,
                { trn_no: trnNo, time_of_payment_done: paymentTime },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success(res?.data?.message);
            fetchWithdrawals();
            setApproveModal(false);
            setTrnNo('');
            setPaymentTime('');
        } catch (error) {
            console.error('Error approving withdrawal:', error);
            toast.error(error?.response?.data?.message || 'Failed to approve withdrawal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelWithdrawal = async () => {
        if (!cancelReason) {
            toast.error('Please provide a reason for cancellation.');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.put(`api/v1/reject-withdrawal/${selectedWithdrawalId}`, {
                cancelReason
            });
            toast.success(res?.data?.message);
            fetchWithdrawals();
            setCancelModal(false);
            setCancelReason('');
            setSelectedWithdrawalId(null);
        } catch (error) {
            console.error('Error cancelling withdrawal:', error);
            toast.error(error?.response?.data?.message || 'Failed to cancel the withdrawal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewMethodDetails = (method, details) => {
        setMethodDetails(details);
        setDetailModal(true);
    };

    useEffect(() => {
        fetchWithdrawals(); // Fetch withdrawals on load
    }, []);

    const heading = [
        'S.No',
        'BHID',
        'Vendor Name',
        'Amount',
        'Payment Method',
        'Payment detail',
        'Transaction No.',
        'Payment Approved',
        'Cancel',
        'Requested At',
        'Time of Payment',
        'Status',
    ];

    return (
        <>
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : withdrawals.length === 0 ? (
                <div className="no-data">
                    <p>No data available</p>
                </div>
            ) : (
                <Table
                    heading="All Withdrawals"
                    tableHeading={heading}
                    tableContent={withdrawals.map((item, index) => (
                        <CTableRow key={item._id}>
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            <CTableDataCell>{item?.vendor_id?.myReferral}</CTableDataCell>
                            <CTableDataCell>
                                <a href={`#/vendor/vendor_detail/${item.vendor_id?._id}`}>
                                    {item.vendor_id?.name}
                                </a>
                            </CTableDataCell>
                            <CTableDataCell>{item.amount}</CTableDataCell>
                            <CTableDataCell>{item.method}</CTableDataCell>
                            <CTableDataCell>
                                <CButton
                                    color="info"
                                    size="sm"
                                    onClick={() => handleViewMethodDetails(item.method, item)}
                                >
                                    View Payment Details
                                </CButton>
                            </CTableDataCell>
                            <CTableDataCell>{item.trn_no}</CTableDataCell>
                            <CTableDataCell>
                                <CButton
                                    color="success"
                                    size="sm"
                                    disabled={item.status !== 'Pending'}
                                    onClick={() => {
                                        setSelectedWithdrawalId(item._id);
                                        setApproveModal(true);
                                    }}
                                >
                                    Approve
                                </CButton>
                            </CTableDataCell>
                            <CTableDataCell>
                                <CButton
                                    style={{ color: 'white' }}
                                    color="danger"
                                    size="sm"
                                    disabled={item.status === 'Approved' || item.status === 'Cancelled'}
                                    onClick={() => {
                                        setSelectedWithdrawalId(item._id);
                                        setCancelModal(true);
                                    }}
                                >
                                    Cancel
                                </CButton>
                            </CTableDataCell>
                            <CTableDataCell>{new Date(item.requestedAt).toLocaleString()}</CTableDataCell>
                            <CTableDataCell>{item.time_of_payment_done ? new Date(item.time_of_payment_done).toLocaleString() : 'N/A'}</CTableDataCell>
                            <CTableDataCell>{item.status}</CTableDataCell>

                        </CTableRow>
                    ))}
                />
            )}

            <CModal visible={cancelModal} onClose={() => setCancelModal(false)}>
                <CModalHeader>
                    <CModalTitle>Cancel Withdrawal</CModalTitle>
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
                    <CButton color="danger" onClick={handleCancelWithdrawal}>
                        Submit
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={approveModal} onClose={() => setApproveModal(false)}>
                <CModalHeader>
                    <CModalTitle>Approve Withdrawal</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div>
                        <CFormInput
                            type="text"
                            label="Transaction Number"
                            value={trnNo}
                            onChange={(e) => setTrnNo(e.target.value)}
                        />
                        <CFormInput
                            type="datetime-local"
                            label="Time of Payment"
                            value={paymentTime}
                            onChange={(e) => setPaymentTime(e.target.value)}
                        />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setApproveModal(false)}>
                        Close
                    </CButton>
                    <CButton color="primary" onClick={handleApproveWithdrawal}>
                        Submit
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={detailModal} onClose={() => setDetailModal(false)}>
                <CModalHeader>
                    <CModalTitle>Payment Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {methodDetails && methodDetails.method === 'Bank Transfer' ? (
                        <div>
                            <p><strong>Bank Name:</strong> {methodDetails.BankDetails?.bankName}</p>
                            <p><strong>Account No:</strong> {methodDetails.BankDetails?.accountNo}</p>
                            <p><strong>IFSC Code:</strong> {methodDetails.BankDetails?.ifsc_code}</p>
                        </div>
                    ) : methodDetails && methodDetails.method === 'UPI' ? (
                        <div>
                            <p><strong>UPI ID:</strong> {methodDetails.upi_details?.upi_id}</p>
                        </div>
                    ) : (
                        <p>No payment details available.</p>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setDetailModal(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
}

export default AllWithdraw;
