import React from 'react';
import {
    CTableDataCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem,
    CFormSwitch,
    CNavLink,
} from '@coreui/react';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const AllParcelVehicle = () => {
    const [vehicles, setVehicles] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/parcel/all-parcel');
            setVehicles(data.data || []);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            toast.error('Failed to load vehicles. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVehicle = async (id) => {
        setLoading(true);
        try {
            const res = await axios.delete(`https://www.appapi.olyox.com/api/v1/parcel/delete-parcel/${id}`);
            toast.success(res?.data?.message || 'Vehicle deleted successfully!');
            fetchVehicles();
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            toast.error('Failed to delete vehicle. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (id, currentStatus) => {
        try {
            const { data } = await axios.put(`https://www.appapi.olyox.com/api/v1/parcel/update_parcel_vehical_status/${id}`, {
                status: !currentStatus,
            });
            toast.success(data?.message || 'Status updated successfully!');
            fetchVehicles();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status. Please try again.');
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
                handleDeleteVehicle(id);
            }
        });
    };

    React.useEffect(() => {
        fetchVehicles();
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = vehicles.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(vehicles.length / itemsPerPage);

    const handlePageChange = (page) => setCurrentPage(page);

    const heading = [
        'S.No',
        'Image',
        'Title',
        'Info',
        'Max Weight (kg)',
        'Price per Km (₹)',
        'Base Fare (₹)',
        'Time to Reach (min)',
        'Position',
        'Any Tag',
        'Tag',
        'Status',
        'Created At',
        'Action',
    ];


    return (
        <>
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : (
                <Table
                    heading="All Parcel Vehicles"
                    btnText="Add New Vehicle"
                    btnURL="/add-parcel-vehical"
                    tableHeading={heading}
                    tableContent={currentData.map((item, index) => (
                        <CTableRow key={item._id}>
                            <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                            <CTableDataCell>
                                <img
                                    src={item.image?.url}
                                    alt={item.title}
                                    style={{ width: '80px', height: '50px', objectFit: 'cover' }}
                                />
                            </CTableDataCell>
                            <CTableDataCell>{item.title}</CTableDataCell>
                            <CTableDataCell>{item.info}</CTableDataCell>
                            <CTableDataCell>{item.max_weight}</CTableDataCell>
                            <CTableDataCell>₹{item.price_per_km}</CTableDataCell>
                            <CTableDataCell>₹{item.BaseFare}</CTableDataCell>
                            <CTableDataCell>{item.time_can_reach} min</CTableDataCell>
                            <CTableDataCell>{item.position}</CTableDataCell>
                            <CTableDataCell>
                                {item.anyTag ? (
                                    <span style={{ color: 'green', fontWeight: 'bold' }}>Yes</span>
                                ) : (
                                    <span style={{ color: 'red', fontWeight: 'bold' }}>No</span>
                                )}
                            </CTableDataCell>
                            <CTableDataCell>{item.tag || '-'}</CTableDataCell>

                            {/* Status Toggle Switch */}
                            <CTableDataCell>
                                <CFormSwitch
                                    color="success"
                                    size="lg"
                                    checked={item.status}
                                    onChange={() => handleStatusToggle(item._id, item.status)}
                                />
                            </CTableDataCell>

                            <CTableDataCell>{new Date(item.createdAt).toLocaleDateString()}</CTableDataCell>

                            <CTableDataCell>
                                <div className="action-parent">
                                    <CNavLink href={`#edit-parcel-vehical/${item._id}`} className="edit">
                                        <i className="ri-pencil-fill"></i>
                                    </CNavLink>
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
        </>
    );
};

export default AllParcelVehicle;
