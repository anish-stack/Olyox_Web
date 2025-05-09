import React from 'react';
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
    const [rechargeData, setRechargeData] = React.useState({});
    const [plans, setPlans] = React.useState([])

    const [selectedPlan, setSelectedPlan] = React.useState('');
    const [vendorId, setVendorId] = React.useState(null);

    const handleRechargeModel = (id) => {
        setVendorId(id);
        setRechargeModel(true);

    };


    const handleFetchBanner = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://www.webapi.olyox.com/api/v1/all_vendor');
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
            const { data } = await axios.get('https://www.webapi.olyox.com/api/v1/membership-plans')
            setRechargeData(data.data)
        } catch (error) {
            console.log("Internal server error", error)
        }
    }

    React.useEffect(() => {
        // handleFetchPlans()
        handleFetchRecharge();
    }, [])

    const handleUpdateActive = async (id, currentStatus) => {
        setLoading(true);
        try {
            const updatedStatus = !currentStatus;
            const res = await axios.put(`https://www.webapi.olyox.com/api/v1/update_vendor_status/${id}`, {
                isActive: updatedStatus,
            });
            toast.success(res?.data?.message);
            handleFetchBanner();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update the status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveChanges = async () => {
        setLoading(true)
        try {
            const { data } = await axios.put('https://www.webapi.olyox.com/api/v1/free_plan_approve', {
                vendor_id: vendorId,
                plan_id: selectedPlan
            })
            console.log(data)
            setRechargeModel(false);
            setLoading(false)


        } catch (error) {
            console.log(error)
            setLoading(false)

            setRechargeModel(false);

        }

    };

    const handleDeleteBanner = async (email) => {
        setLoading(true);
        try {
            const res = await axios.delete('https://www.webapi.olyox.com/api/v1/delete_account', {
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
        console.log(selected)
        setLoading(true);
        try {
            const res = await axios.post(`https://www.webapi.olyox.com/api/v1/verify_document?id=${selected}`);
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
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||

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
    };
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when search query changes
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1); // Reset to first page when status filter changes
    };
    const handleModalOpen = (data, type, id, documentVerify) => {
        setModalData(data);
        setSelected(id)
        setModalType(type);
        setShowModal(true);
        setDocumentVerify(documentVerify)
    };

    const heading = ['S.No', 'Name', 'Referral Id', 'Email', 'Number', 'KYC Status', 'Free Plan Approve', 'Active/Block', 'View Detail', 'Document Update', 'Action'];

    return (
        <>

            <div className="d-flex flex-column flex-md-row align-items-center mb-3">
                <div className="mb-2 col-10 mb-md-0 me-md-3">
                    <CFormInput
                        type="text"
                        placeholder="Search by Name or Email Or BH"
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
                    // btnText="Add Vendor"
                    btnURL="/vendor/add-vendor"
                    tableHeading={heading}
                    tableContent={currentData.map((item, index) => (
                        <CTableRow key={item._id}>
                            <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                            <CTableDataCell>
                                <a href={`#/vendor/vendor_detail/${item._id}`}>{item.name}</a>
                            </CTableDataCell>
                            <CTableDataCell>{item?.myReferral}</CTableDataCell>
                            <CTableDataCell>{item.email}</CTableDataCell>
                            <CTableDataCell>{item.number}</CTableDataCell>
                            <CTableDataCell>
                                <CButton
                                    color="warning"
                                    onClick={() => handleModalOpen(item.Documents, 'Documents', item._id, item.documentVerify)}
                                >
                                    View Documents
                                </CButton>
                            </CTableDataCell>
                            <CTableDataCell>
                                <CButton
                                    color="warning"
                                    disabled={!item.documentVerify}
                                    onClick={() => handleRechargeModel(item._id)}
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
                                <div className="action-parent">
                                    <CNavLink href={`#/vendor/edit-vendor/${item._id}`} className="edit">
                                        <i className="ri-pencil-fill"></i>
                                    </CNavLink>
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
                                width: '100%', // Set the desired width
                                maxWidth: '1200px', // Add a max-width to prevent excessive growth
                                margin: '0 auto', // Center the modal horizontally
                                background: '#fff', // Optional: ensure a white background
                                padding: '20px', // Optional: add padding
                                borderRadius: '8px', // Optional: rounded corners
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Optional: add a shadow for better appearance
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
                                {/* Document 1 */}
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

                                {/* Document 2 */}
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

                                {/* Document 3 */}
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

                    <div
                        className="modal fade"
                        id="rechargeModal"
                        tabIndex="-1"
                        aria-labelledby="rechargeModalLabel"
                        aria-hidden="true"
                    >

                        <h5 className="modal-title" id="rechargeModalLabel">
                            Select Plan
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => setRechargeModel(false)}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
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
                                    {rechargeData && rechargeData.length > 0 && (
                                        rechargeData.map((item, index) => (
                                            <option key={index} value={item._id}>
                                                {item.title} - Rs:{item.price} - Level {item.level} - {item.validityDays}/{item.whatIsThis}
                                            </option>
                                        ))
                                    )}

                                </select>
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
                            disabled={loading}
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
