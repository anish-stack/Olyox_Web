import React, { useEffect, useState } from 'react';
import { Truck, MapPin, Phone, FileText, CheckCircle, XCircle, ArrowLeft, CreditCard, Calendar, Award } from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function ParcelDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    // State for storing parcel delivery person data
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock function to fetch parcel delivery person details
    const fetchVendorDetails = async () => {
        setLoading(true);
        try {
            // In a real implementation, you would use axios like this:
            const { data } = await axios.get(`https://www.appapi.olyox.com/api/v1/parcel/get_single_parcel/${id}`);
            setVendor(data.data);
        } catch (error) {
            console.error('Error fetching parcel delivery person details:', error);
            //   alert('Failed to load parcel delivery person details. Please try again.');
        } finally {
            setLoading(false);
        }
        
    };

    useEffect(() => {
        fetchVendorDetails();
    }, []);

    const handleDocumentVerifyToggle = async (id, status) => {
        // In a real implementation, you would use axios like this:
        try {
          const res = await axios.put(`https://www.appapi.olyox.com/api/v1/parcel/update_parcel_document_verify/${id}`, {
            documentVerify: !status
          });
          toast.success('Vendor status updated successfully.');
          fetchVendorDetails();
        } catch (error) {
          console.log("Internal server error", error);
          alert('Failed to update status. Please try again.');
        }
    };

    const handleBackToList = () => {
        // console.log('Navigate back to parcel delivery persons list');
        // In a real app, this would use navigation
        navigate('/parcel/all-parcel-vendor')
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="text-center my-5">
                <h3>Parcel delivery person not found</h3>
                <button className="btn btn-primary mt-3" onClick={handleBackToList}>
                    Back to Parcel Delivery Persons List
                </button>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <button
                className="btn btn-outline-primary mb-4"
                onClick={handleBackToList}
            >
                <ArrowLeft className="me-2" size={18} /> Back to Parcel Delivery Persons List
            </button>

            <div className="row">
                <div className="col-12">
                    <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <div>
                                <h3 className="mb-0">{vendor.name}</h3>
                                <div className="small">ID: {vendor._id}</div>
                            </div>
                            <span className={`badge ${vendor.isActive ? 'bg-success' : 'bg-danger'} rounded-pill fs-6`}>
                                {vendor.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3 mb-4 text-center">
                                    <div
                                        className="bg-light d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3"
                                        style={{ width: '150px', height: '150px' }}
                                    >
                                        <span className="text-muted h1">{vendor.name.charAt(0)}</span>
                                    </div>
                                    <span className={`badge ${vendor.is_on_order ? 'bg-warning' : 'bg-success'} rounded-pill`}>
                                        {vendor.is_on_order ? 'On Delivery' : 'Available'}
                                    </span>
                                </div>
                                <div className="col-md-9">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <Phone className="text-primary me-2" size={18} />
                                                <div>
                                                    <div className="text-muted small">Phone</div>
                                                    <div>{vendor.phone}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <Truck className="text-primary me-2" size={18} />
                                                <div>
                                                    <div className="text-muted small">Vehicle</div>
                                                    <div>{vendor.bikeDetails.make} ({vendor.bikeDetails.model})</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <MapPin className="text-primary me-2" size={18} />
                                                <div>
                                                    <div className="text-muted small">Address</div>
                                                    <div>{vendor.address}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <FileText className="text-primary me-2" size={18} />
                                                <div>
                                                    <div className="text-muted small">License Plate</div>
                                                    <div>{vendor.bikeDetails.licensePlate}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <Calendar className="text-primary me-2" size={18} />
                                                <div>
                                                    <div className="text-muted small">Joined On</div>
                                                    <div>{new Date(vendor.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="d-flex align-items-center">
                                                <CreditCard className="text-success me-2" size={18} />
                                                <div>
                                                    <div className="text-muted small">Payment Status</div>
                                                    <div>{vendor.amountPaid > 0 ? 'Paid' : 'Unpaid'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-light">
                            <h4 className="mb-0">Delivery Person Information</h4>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Vehicle Make:</span>
                                        <span className="fw-bold">{vendor.bikeDetails.make}</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Vehicle Model:</span>
                                        <span className="fw-bold">{vendor.bikeDetails.model}</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Vehicle Year:</span>
                                        <span className="fw-bold">{vendor.bikeDetails.year}</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Documents Uploaded:</span>
                                        <span className={`badge ${vendor.isDocumentUpload ? 'bg-success' : 'bg-warning'}`}>
                                            {vendor.isDocumentUpload ? 'Uploaded' : 'Pending'}
                                        </span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Document Verified:</span>
                                        <span className={`badge ${vendor.DocumentVerify ? 'bg-success' : 'bg-warning'}`}>
                                            {vendor.DocumentVerify ? 'Verified' : 'Pending'}
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-light">
                            <h4 className="mb-0">Account Information</h4>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Account Type:</span>
                                        <span className="fw-bold">{vendor.type}</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Amount Paid:</span>
                                        <span className="fw-bold">₹{vendor.amountPaid}</span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>OTP Block Status:</span>
                                        <span className={`badge ${vendor.isOtpBlock ? 'bg-danger' : 'bg-success'}`}>
                                            {vendor.isOtpBlock ? 'Blocked' : 'Not Blocked'}
                                        </span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>Admin Block Status:</span>
                                        <span className={`badge ${vendor.isBlockByAdmin ? 'bg-danger' : 'bg-success'}`}>
                                            {vendor.isBlockByAdmin ? 'Blocked' : 'Not Blocked'}
                                        </span>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="d-flex justify-content-between">
                                        <span>OTP Verified:</span>
                                        <span className={`badge ${vendor.isOtpVerify ? 'bg-success' : 'bg-warning'}`}>
                                            {vendor.isOtpVerify ? 'Verified' : 'Pending'}
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-header bg-light">
                            <h4 className="mb-0">Documents</h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {vendor.documents.license && (
                                    <div className="col-md-3 mb-4">
                                        <div className="card">
                                            <img
                                                src={vendor.documents.license}
                                                className="card-img-top"
                                                alt="License"
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">Driving License</h5>
                                                <a
                                                    href={vendor.documents.license}
                                                    className="btn btn-primary btn-sm"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    View Full Size
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {vendor.documents.rc && (
                                    <div className="col-md-3 mb-4">
                                        <div className="card">
                                            <img
                                                src={vendor.documents.rc}
                                                className="card-img-top"
                                                alt="RC"
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">Registration Certificate</h5>
                                                <a
                                                    href={vendor.documents.rc}
                                                    className="btn btn-primary btn-sm"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    View Full Size
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {vendor.documents.pan && (
                                    <div className="col-md-3 mb-4">
                                        <div className="card">
                                            <img
                                                src={vendor.documents.pan}
                                                className="card-img-top"
                                                alt="PAN Card"
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">PAN Card</h5>
                                                <a
                                                    href={vendor.documents.pan}
                                                    className="btn btn-primary btn-sm"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    View Full Size
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {vendor.documents.aadhar && (
                                    <div className="col-md-3 mb-4">
                                        <div className="card">
                                            <img
                                                src={vendor.documents.aadhar}
                                                className="card-img-top"
                                                alt="Aadhar Card"
                                                style={{ height: '200px', objectFit: 'cover' }}
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">Aadhaar Card</h5>
                                                <a
                                                    href={vendor.documents.aadhar}
                                                    className="btn btn-primary btn-sm"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    View Full Size
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-end mb-4">
                <button
                    className="btn btn-primary me-2"
                    onClick={() => navigate(`/parcel/edit-parcel-vendor/${vendor._id}`)}
                >
                    Edit Parcel Delivery Person
                </button>
                {/* <button
                    className={`btn ${vendor.isActive ? 'btn-danger' : 'btn-success'} me-2`}
                    onClick={() => console.log(`Toggle active status for ${vendor._id}`)}
                >
                    {vendor.isActive ? 'Deactivate' : 'Activate'}
                </button> */}
                <button
                    className={`btn ${vendor.DocumentVerify ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => handleDocumentVerifyToggle(vendor._id, vendor.DocumentVerify)}
                >
                    {vendor.DocumentVerify ? 'Document Unverify' : 'Document Verify'}
                </button>
            </div>
        </div>
    );
}

export default ParcelDetail;