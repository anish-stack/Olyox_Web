import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function VendorDetail() {
    const { id } = useParams();
    const [vendor, setVendor] = useState({});
    const [withDrawals, setWithDrawals] = useState([]);
    const [Recharge, setRecharge] = useState([]);

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [activeLevelTab, setLevelActiveTab] = useState('Level1');
    const levels = ['Level1', 'Level2', 'Level3', 'Level4', 'Level5', 'Level6', 'Level7'];
    const fetchVendor = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`https://www.webapi.olyox.com/api/v1/get_Single_Provider/${id}`);
            setVendor(data.data);
            console.log(data.data)
        } catch (error) {
            console.error("Internal server error:", error);
        } finally {
            setLoading(false);
        }
    };
    

    const fetchWithdrawls = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`https://www.webapi.olyox.com/api/v1/admin-withdrawals?id=${id}`);
            setWithDrawals(data.
                withdrawal
            );
            console.log(data.
                withdrawal
            )
        } catch (error) {
            console.error("Internal server error:", error);
        }

    }

    const fetchRecharge = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`https://www.webapi.olyox.com/api/v1/get-all-admin-recharge?id=${id}`);
            setRecharge(data.data);
            console.log(data.
                data
            )
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Internal server error:", error);
        }

    }

    useEffect(() => {
        fetchVendor();
        fetchWithdrawls()
        fetchRecharge()
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading vendor details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                {/* Header Card */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body p-4">
                        <div className="row align-items-center">
                            <div className="col-auto">
                                <div className="bg-primary bg-opacity-10 rounded-circle p-4">
                                    <i className="fas fa-user-tie fa-2x text-primary"></i>
                                </div>
                            </div>
                            <div className="col">
                                <h2 className="mb-1">{vendor.name}</h2>
                                <p className="text-muted mb-0">
                                    <i className="fas fa-id-badge me-2"></i>
                                    ID: {vendor._id}
                                </p>
                            </div>
                            <div className="col-auto">
                                <span className={`badge ${vendor.isActive ? 'bg-success' : 'bg-danger'} p-2`}>
                                    {vendor.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <ul className="nav nav-pills mb-4">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
                            onClick={() => setActiveTab('basic')}
                        >
                            <i className="fas fa-info-circle me-2"></i>
                            Basic Info
                        </button>
                    </li>
                    {/* <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'address' ? 'active' : ''}`}
                            onClick={() => setActiveTab('address')}
                        >
                            <i className="fas fa-map-marker-alt me-2"></i>
                            Address
                        </button>
                    </li> */}
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`}
                            onClick={() => setActiveTab('documents')}
                        >
                            <i className="fas fa-file-alt me-2"></i>
                            Documents
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'Category' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Category')}
                        >
                            <i className="fas fa-file-alt me-2"></i>
                            Category Earning
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'Recharge' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Recharge')}
                        >
                            <i className="fas fa-file-alt me-2"></i>
                            Recharge History
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'Withdrawal' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Withdrawal')}
                        >
                            <i className="fas fa-file-alt me-1"></i>
                            Withdrawal History
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'Refferal-earning' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Refferal-earning')}
                        >
                            <i className="fas fa-file-alt me-2"></i>
                            Referral Earning
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'Refferal' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Refferal')}
                        >
                            <i className="fas fa-file-alt me-2"></i>
                            Referral History
                        </button>
                    </li>

                </ul>

                {/* Content Area */}
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        {activeTab === 'basic' && (
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="card h-100 border-0 bg-light">
                                        <div className="card-body">
                                            <h5 className="card-title mb-4">Contact Information</h5>
                                            <div className="mb-3">
                                                <label className="text-muted small">Email</label>
                                                <p className="mb-2">{vendor.email}</p>
                                            </div>
                                            <div className="mb-3">
                                                <label className="text-muted small">Phone</label>
                                                <p className="mb-2">{vendor.number}</p>
                                            </div>
                                            <div className="mb-3">
                                                <label className="text-muted small">Category</label>
                                                <p className="mb-2">{vendor.category?.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card h-100 border-0 bg-light">
                                        <div className="card-body">
                                            <h5 className="card-title mb-4">Account Details</h5>
                                            <div className="mb-3">
                                                <label className="text-muted small">Wallet Balance</label>
                                                <p className="mb-2">₹{vendor.wallet || '0'}</p>
                                            </div>
                                            <div className="mb-3">
                                                <label className="text-muted small">Referral Code</label>
                                                <p className="mb-2">{vendor.myReferral}</p>
                                            </div>
                                            <div className="mb-3">
                                                <label className="text-muted small">Plan</label>
                                                <p className="mb-2">{vendor?.member_id?.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title mb-4">Address Details</h5>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="text-muted small">Street Address</label>
                                                <p className="mb-2">{vendor.address?.street_address || 'N/A'}</p>
                                            </div>
                                            <div className="mb-3">
                                                <label className="text-muted small">Area</label>
                                                <p className="mb-2">{vendor.address?.area || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="text-muted small">Landmark</label>
                                                <p className="mb-2">{vendor.address?.landmark || 'N/A'}</p>
                                            </div>
                                            <div className="mb-3">
                                                <label className="text-muted small">Pincode</label>
                                                <p className="mb-2">{vendor.address?.pincode || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}



                        {activeTab === 'documents' && (
                            <div className="card border-0 bg-light">
                                <div className="card-body">
                                    <h5 className="card-title mb-4">Document Gallery</h5>
                                    <div className="row g-4">
                                        {vendor.Documents?.documentFirst?.image && (
                                            <div className="col-md-4">
                                                <div className="card">
                                                    <img
                                                        src={vendor.Documents.documentFirst.image}
                                                        className="card-img-top"
                                                        alt="Aadhar Front"
                                                        style={{ height: '200px', objectFit: 'cover' }}
                                                    />
                                                    <div className="card-body">
                                                        <h6 className="card-title">Aadhar Front</h6>
                                                        <a href={vendor.Documents.documentFirst.image}
                                                            target="_blank"
                                                            className="btn btn-sm btn-primary"
                                                            rel="noopener noreferrer">
                                                            <i className="fas fa-external-link-alt me-2"></i>
                                                            View
                                                        </a>
                                                    </div>

                                                </div>
                                            </div>
                                        )}
                                        {vendor.Documents?.documentSecond?.image && (
                                            <div className="col-md-4">
                                                <div className="card">
                                                    <img
                                                        src={vendor.Documents.documentSecond.image}
                                                        className="card-img-top"
                                                        alt="Aadhar Front"
                                                        style={{ height: '200px', objectFit: 'cover' }}
                                                    />
                                                    <div className="card-body">
                                                        <h6 className="card-title">Aadhar Back</h6>
                                                        <a href={vendor.Documents.documentSecond.image}
                                                            target="_blank"
                                                            className="btn btn-sm btn-primary"
                                                            rel="noopener noreferrer">
                                                            <i className="fas fa-external-link-alt me-2"></i>
                                                            View
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {vendor.Documents?.documentThird?.image && (
                                            <div className="col-md-4">
                                                <div className="card">
                                                    <img
                                                        src={vendor.Documents.documentThird.image}
                                                        className="card-img-top"
                                                        alt="Aadhar Front"
                                                        style={{ height: '200px', objectFit: 'cover' }}
                                                    />
                                                    <div className="card-body">
                                                        <h6 className="card-title">Pan Card</h6>
                                                        <a href={vendor.Documents.documentThird.image}
                                                            target="_blank"
                                                            className="btn btn-sm btn-primary"
                                                            rel="noopener noreferrer">
                                                            <i className="fas fa-external-link-alt me-2"></i>
                                                            View
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {/* Similar blocks for other documents */}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Category' && (
                            <>
                                <div className="container mt-4">
                                    <h2 className="text-center text-primary mb-3">Category Earning</h2>
                                    <p className="text-center text-muted">
                                        This is currently deactivated. Please ignore this.
                                    </p>
                                </div>
                            </>

                        )}
                        {activeTab === 'Recharge' && (
                            <>
                                <h2 className="text-center mb-4">Recharge History</h2>
                                {Recharge.length === 0 ? (
                                    <p className="text-center">No recharge history available.</p>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Transaction No.</th>
                                                    <th>Plan</th>
                                                    <th>Amount</th>
                                                    <th>Status</th>

                                                    <th>Validity</th>
                                                    <th>Start Date</th>
                                                    <th>End Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Recharge.map((recharge, index) => (
                                                    <tr key={index}>
                                                        <td>{recharge.trn_no}</td>
                                                        <td>{recharge?.member_id?.title}</td>
                                                        <td>{recharge.amount}</td>
                                                        <td>{recharge.payment_approved ? 'Approved' : 'Pending'}</td>

                                                        <td>{recharge.member_id?.validityDays} {recharge?.member_id?.whatIsThis}</td>
                                                        <td>{new Date(recharge.createdAt).toLocaleDateString()}</td>
                                                        <td>{new Date(recharge.end_date).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'Refferal' && (
                            <>
                                <h2>Referral History</h2>
                                <ul className="nav nav-tabs">
                                    {levels.map((level, index) => (
                                        <li className="nav-item" key={index}>
                                            <button
                                                className={`nav-link ${activeLevelTab === level ? 'active' : ''}`}
                                                onClick={() => setLevelActiveTab(level)}
                                            >
                                                {level}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="tab-content mt-3">
                                    {levels.map((level, index) => (
                                        <div
                                            key={index}
                                            className={`tab-pane fade ${activeLevelTab === level ? 'show active' : ''}`}
                                        >
                                            <div className="card border-0 bg-light">
                                                <div className="card-body">
                                                    <h5>{level} Details</h5>

                                                    {/* Render Level Data in Table Format */}
                                                    {vendor[level]?.length > 0 ? (
                                                        <div className="table-responsive">
                                                            <table className="table table-striped table-bordered">
                                                                <thead className="thead-dark">
                                                                    <tr>
                                                                        <th>#BHID</th>
                                                                        <th>Name</th>
                                                                        <th>Email</th>
                                                                        <th>Phone</th>
                                                                        <th>Category</th>
                                                                        <th>Plan</th>
                                                                        <th>Plan Status</th>
                                                                        <th>Action</th>


                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {vendor[level].map((referral, idx) => (
                                                                        <tr key={idx}>
                                                                            <td>{referral?.myReferral}</td>
                                                                            <td>{referral.name}</td>
                                                                            <td>{referral.email}</td>
                                                                            <td>{referral.number}</td>
                                                                            <td>{referral?.category?.title}</td>
                                                                            <td>{referral?.member_id?.title || 'Recharge Not Done'}</td>
                                                                            <td>{referral?.plan_status ? 'Active' : 'De Active'}</td>

                                                                            <td>
                                                                                <a href={`#/vendor/vendor_detail/${referral._id}`}>View Details</a>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : (
                                                        <p>No data available for {level}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>



                            </>
                        )}
                 {activeTab === 'Refferal-earning' && (
    <>
        <h2>Referral Earning</h2>
        <p className="text-muted">This section is a work in progress. Please ignore for now.</p>
    </>
)}

                        {activeTab === 'Withdrawal' && (
                            <>
                                <h2>Withdrawal History</h2>
                                <div className="container mt-4">
                                    {withDrawals && withDrawals.length > 0 ? (
                                        <>

                                            <table className="table table-bordered table-striped">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th>Amount</th>
                                                        <th>Method</th>
                                                        <th>Status</th>
                                                        <th>Requested At</th>

                                                        <th>UPI ID</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {withDrawals.map((withdrawal, index) => (
                                                        <tr key={index}>
                                                            <td>{withdrawal.amount}</td>
                                                            <td>{withdrawal.method}</td>
                                                            <td>
                                                                <span

                                                                >
                                                                    {withdrawal.status}
                                                                </span>
                                                            </td>
                                                            <td>{new Date(withdrawal.requestedAt).toLocaleString()}</td>

                                                            <td>{withdrawal.upi_details.upi_id}</td>


                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                    ) : (
                                        <p>No withdrawal history available.</p>
                                    )}
                                </div>

                            </>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                {/* <div className="d-flex justify-content-between mt-4">
                    <button
                        className="btn btn-light"
                        onClick={() => window.history.back()}
                    >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back
                    </button>
                    <button className="btn btn-primary">
                        <i className="fas fa-edit me-2"></i>
                        Edit Details
                    </button>
                </div> */}
            </div>
        </div>
    );
}

export default VendorDetail;
