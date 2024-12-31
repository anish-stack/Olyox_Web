import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function VendorDetail() {
    const { id } = useParams();
    const [vendor, setVendor] = useState({});
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    const fetchVendor = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`https://olyox.digital4now.in/api/v1/get_Single_Provider/${id}`);
            setVendor(data.data);
        } catch (error) {
            console.error("Internal server error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendor();
    }, []);

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
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 'address' ? 'active' : ''}`}
                            onClick={() => setActiveTab('address')}
                        >
                            <i className="fas fa-map-marker-alt me-2"></i>
                            Address
                        </button>
                    </li>
                    <li className="nav-item">
                        <button 
                            className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`}
                            onClick={() => setActiveTab('documents')}
                        >
                            <i className="fas fa-file-alt me-2"></i>
                            Documents
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
                            </div>
                        )}

                        {activeTab === 'address' && (
                            <div className="card border-0 bg-light">
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