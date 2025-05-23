import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    CTableDataCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem,
    CFormSwitch,
    CNavLink,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton,
    CFormInput,
} from '@coreui/react';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

function AllVendor() {
    const location = useLocation();
    const navigate = useNavigate();

    const [category, setCategory] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [modalData, setModalData] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('');

    const [showModal, setShowModal] = React.useState(false);
    const [modalType, setModalType] = React.useState('');
    const [selected, setSelected] = React.useState('');
    const [documentVerify, setDocumentVerify] = React.useState('');
    const [rechargeModel, setRechargeModel] = React.useState(false);
    const [allRechargeData, setAllRechargeData] = React.useState([]);
    const [filteredRechargeData, setFilteredRechargeData] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState(null);
    const [selectedPlan, setSelectedPlan] = React.useState('');
    const [vendorId, setVendorId] = React.useState(null);

    // Get page from URL parameters and set current page
    React.useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const pageFromUrl = urlParams.get('page');
        if (pageFromUrl) {
            setCurrentPage(parseInt(pageFromUrl, 10));
        }
    }, [location.search]);

    // Update URL when page changes - Fixed for hash routing
    const updateUrlWithPage = (page) => {
        navigate(`/vendor/all_vendor?page=${page}`, { replace: true });
    };

    const handleRechargeModel = (id, item) => {
        setVendorId(id);

        // Set the selected category and filter recharge data
        if (item?.title) {
            setSelectedCategory(item.title);
            filterRechargeDataByCategory(item.title);
        } else {
            // If no category, show all recharge plans
            setSelectedCategory(null);
            setFilteredRechargeData(allRechargeData);
        }

        setRechargeModel(true);
    };

    // Function to filter recharge data based on category
    const filterRechargeDataByCategory = (categoryTitle) => {
        if (!categoryTitle || !allRechargeData.length) {
            setFilteredRechargeData(allRechargeData);
            return;
        }

        const normalizedSelectedCategory = categoryTitle.toLowerCase().replace(/\s+/g, '');

        const filtered = allRechargeData.filter(plan => {
            if (!plan.category) return false;

            const normalizedPlanCategory = plan.category.toLowerCase().replace(/\s+/g, '');
            return (
                normalizedPlanCategory.includes(normalizedSelectedCategory) ||
                normalizedSelectedCategory.includes(normalizedPlanCategory)
            );
        });

        // If no matches found, show all plans
        if (filtered.length === 0) {
            setFilteredRechargeData(allRechargeData);
        } else {
            setFilteredRechargeData(filtered);
        }
    };

    const handleFetchBanner = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://webapi.olyox.com/api/v1/all_vendor');
            const allData = data.data;
            setCategory(allData.reverse() || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFetchRecharge = async () => {
        try {
            const { data } = await axios.get('https://webapi.olyox.com/api/v1/membership-plans-admin');
            setAllRechargeData(data.data);
            setFilteredRechargeData(data.data);
        } catch (error) {
            console.log("Internal server error", error);
        }
    };

    React.useEffect(() => {
        handleFetchRecharge();
    }, []);

    const handleUpdateActive = async (id, currentStatus) => {
        setLoading(true);
        try {
            const updatedStatus = !currentStatus;
            const res = await axios.put(`https://webapi.olyox.com/api/v1/update_vendor_status/${id}`, {
                isActive: updatedStatus,
            });

            if (updatedStatus) {
                toast.success('Vendor has been activated successfully.');
            } else {
                toast.success('Vendor has been deactivated.');
            }

            handleFetchBanner();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update the status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            const { data } = await axios.put('https://webapi.olyox.com/api/v1/free_plan_approve', {
                vendor_id: vendorId,
                plan_id: selectedPlan
            });
            console.log(data);
            toast.success('Plan successfully assigned');
            setRechargeModel(false);
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error('Failed to assign plan');
            setLoading(false);
            setRechargeModel(false);
        }
    };

    const handleDeleteBanner = async (email) => {
        setLoading(true);
        try {
            const res = await axios.delete('https://webapi.olyox.com/api/v1/delete_account', {
                data: { email },
            });
            toast.success(res?.data?.message);
            handleFetchBanner();
        } catch (error) {
            console.error('Error deleting:', error);
            toast.error('Failed to delete. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyDocument = async () => {
        console.log(selected);
        setLoading(true);
        try {
            const res = await axios.post(`https://webapi.olyox.com/api/v1/verify_document?id=${selected}`);
            console.log(res?.data);
            toast.success(res?.data?.message);
            handleFetchBanner();
            setShowModal(false);
        } catch (error) {
            console.error('Error verify Documents:', error);
            toast.error('Failed to Verify. Please try again.');
        } finally {
            setLoading(false);
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
                handleDeleteBanner(email);
            }
        });
    };

    React.useEffect(() => {
        handleFetchBanner();
    }, []);

    const filteredData = category
        .filter(item => {
            // Search in name, email, number, or referral
            const searchMatch =
                (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.number && item.number.toString().includes(searchQuery)) ||
                (item?.myReferral && item.myReferral.toLowerCase().includes(searchQuery.toLowerCase()));

            // Apply status filter
            const statusMatch = statusFilter ? item.isActive.toString() === statusFilter : true;

            return searchMatch && statusMatch;
        });

    const itemsPerPage = 20;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Calculate the total number of pages based on filtered data
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    const handlePageChange = (page) => {
        setCurrentPage(page);
        updateUrlWithPage(page);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
        updateUrlWithPage(1);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
        updateUrlWithPage(1);
    };

    const handleModalOpen = (data, type, id, documentVerify) => {
        setModalData(data);
        setSelected(id);
        setModalType(type);
        setShowModal(true);
        setDocumentVerify(documentVerify);
    };

    // Handle edit vendor navigation with current page - Fixed for hash routing
    const handleEditVendor = (vendorId) => {
        navigate(`/vendor/edit-vendor/${vendorId}?returnPage=${currentPage}`);
    };

    // Reset selectedPlan when rechargeModel is opened or closed
    React.useEffect(() => {
        if (!rechargeModel) {
            setSelectedPlan('');
        }
    }, [rechargeModel]);

    const heading = ['S.No', 'Name', 'Referral Id', 'Referred By', 'Email', 'Number', 'KYC Status', 'Free Plan Approve', 'Active/Block', 'View Detail', 'Document Update', 'Created At', 'Action'];

    return (
        <>
            <div className="d-flex flex-column flex-md-row align-items-center mb-3">
                <div className="mb-2 col-10 mb-md-0 me-md-3">
                    <CFormInput
                        type="text"
                        placeholder="Search by Name, Email, Phone Number or BH"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="form-control"
                    />
                </div>
                <div className="mb-2 col-2 mb-md-0 me-md-3">
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        aria-label="Select Vendor Status"
                        className="form-select"
                    >
                        <option value="">Select Status</option>
                        <option value="true">Active</option>
                        <option value="false">Blocked</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : category.length === 0 ? (
                <div className="no-data">
                    <p>No data available</p>
                </div>
            ) : (
                <Table
                    heading="All Vendors"
                    btnURL="/vendor/add-vendor"
                    tableHeading={heading}
                    tableContent={currentData.map((item, index) => (
                        <CTableRow key={item._id}>
                            <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                            <CTableDataCell>
                                <a href={`#/vendor/vendor_detail/${item._id}`}>{item.name}</a>
                            </CTableDataCell>
                            <CTableDataCell>{item?.myReferral}</CTableDataCell>
                            <CTableDataCell>{item?.referral_code_which_applied}</CTableDataCell>
                            <CTableDataCell>{item.email}</CTableDataCell>
                            <CTableDataCell>{item.number}</CTableDataCell>
                            <CTableDataCell>
                                <CButton
                                    color={item.documentVerify ? 'success' : 'danger'}
                                    onClick={() =>
                                        handleModalOpen(item.Documents, 'Documents', item._id, item.documentVerify)
                                    }
                                    style={{ color: 'white' }}
                                >
                                    View Documents
                                </CButton>
                            </CTableDataCell>
                            <CTableDataCell>
                                <CButton
                                    color="warning"
                                    onClick={() => handleRechargeModel(item._id, item?.category)}
                                >
                                    Recharge
                                </CButton>
                            </CTableDataCell>
                            <CTableDataCell>
                                <CFormSwitch
                                    id={`formSwitch-${item._id}`}
                                    checked={item.isActive}
                                    onChange={() => handleUpdateActive(item._id, item.isActive)}
                                />
                            </CTableDataCell>
                            <CTableDataCell>
                                <CButton color="info">
                                    <a style={{ color: 'white' }} href={`#/vendor/vendor_detail/${item._id}`}>View</a>
                                </CButton>
                            </CTableDataCell>
                            <CTableDataCell>
                                <CButton color="info">
                                    <a style={{ color: 'white' }} href={`#/update-vendor-documents/${item._id}`}>View</a>
                                </CButton>
                            </CTableDataCell>
                            <CTableDataCell>
                                {new Date(item.createdAt).toLocaleDateString('en-GB')}
                            </CTableDataCell>

                            <CTableDataCell>
                                <div className="action-parent">
                                    <div className="edit" onClick={() => handleEditVendor(item._id)}>
                                        <i className="ri-pencil-fill"></i>
                                    </div>
                                    <div className="delete" onClick={() => confirmDelete(item.email)}>
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
            <CModal visible={showModal} onClose={() => setShowModal(false)}>
                <CModalHeader>
                    <h5>{modalType}</h5>
                </CModalHeader>
                <CModalBody>
                    {modalType === 'Address' && (
                        <>
                            <p>Area: {modalData?.area}</p>
                            <p>Street: {modalData?.street_address}</p>
                            <p>Landmark: {modalData?.landmark}</p>
                            <p>Pincode: {modalData?.location?.pincode}</p>
                        </>
                    )}
                    {modalType === 'Referrals' && modalData?.length > 0 && (
                        <div
                            style={{
                                width: '100%',
                                maxWidth: '1200px',
                                margin: '0 auto',
                                background: '#fff',
                                padding: '20px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            <h3>Referrals</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>#ID</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Redirect</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalData.map((referral, idx) => (
                                        <tr key={idx}>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{referral._id || 'N/A'}</td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{referral.name || 'N/A'}</td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                <a href={`#/vendor/vendor_detail/${referral._id}`} className="edit">
                                                    <i className="ri-pencil-fill"></i> View
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {modalType === 'Documents' && (
                        <>
                            <div className="mb-3">
                                <p className={`text-${documentVerify ? 'success' : 'danger'} font-weight-bold`}>
                                    {documentVerify ? 'Verified' : 'Not Verified'}
                                </p>
                            </div>

                            <div className="row">
                                <div className="col-12 col-md-4 mb-3">
                                    <p>
                                        <a href={modalData?.documentFirst?.image} target='_blank' rel='noopener noreferrer'>
                                            <img
                                                src={modalData?.documentFirst?.image}
                                                alt="Document 1"
                                                className="img-fluid rounded shadow-sm"
                                                width={100}
                                            />
                                        </a>
                                    </p>
                                </div>

                                <div className="col-12 col-md-4 mb-3">
                                    <p>
                                        <a href={modalData?.documentSecond?.image} target='_blank' rel='noopener noreferrer'>
                                            <img
                                                src={modalData?.documentSecond?.image}
                                                alt="Document 2"
                                                className="img-fluid rounded shadow-sm"
                                                width={100}
                                            />
                                        </a>
                                    </p>
                                </div>

                                <div className="col-12 col-md-4 mb-3">
                                    <p>
                                        <a href={modalData?.documentThird?.image} target='_blank' rel='noopener noreferrer'>
                                            <img
                                                src={modalData?.documentThird?.image}
                                                alt="Document 3"
                                                className="img-fluid rounded shadow-sm"
                                                width={100}
                                            />
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary w-100"
                                onClick={() => handleVerifyDocument()}
                            >
                                Verify Documents
                            </button>
                        </>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={rechargeModel} onClose={() => setRechargeModel(false)}>
                <CModalHeader>
                    <h5>Assign Recharge</h5>
                </CModalHeader>
                <CModalBody>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                {selectedCategory && (
                                    <p className="mb-2"><strong>Selected Category:</strong> {selectedCategory}</p>
                                )}
                                <label htmlFor="planSelect" className="form-label">
                                    Choose a Plan
                                </label>
                                <select
                                    className="form-select"
                                    id="planSelect"
                                    value={selectedPlan}
                                    onChange={(e) => setSelectedPlan(e.target.value)}
                                >
                                    <option value="" disabled>
                                        Select a plan
                                    </option>
                                    {filteredRechargeData && filteredRechargeData.length > 0 ? (
                                        filteredRechargeData.map((item, index) => (
                                            <option key={index} value={item._id}>
                                                {item.title} - Rs:{item.price} - Level {item.level} - {item.validityDays}/{item.whatIsThis}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No plans available</option>
                                    )}
                                </select>
                                {filteredRechargeData.length === 0 && (
                                    <div className="text-warning mt-2">
                                        No matching plans found for this category. Showing all available plans.
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={() => setRechargeModel(false)}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            disabled={loading || !selectedPlan}
                            className="btn btn-primary"
                            onClick={handleSaveChanges}
                        >
                            {loading ? 'Please Wait ...' : 'Save Changes'}
                        </button>
                    </div>
                </CModalBody>
            </CModal>
        </>
    );
}

export default AllVendor;