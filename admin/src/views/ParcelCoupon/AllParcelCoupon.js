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

const AllParcelCoupon = () => {
    const [coupons, setCoupons] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/parcel/parcel-coupon');
            setCoupons(data.data.reverse() || []);
        } catch (error) {
            console.error('Error fetching coupons:', error);
            toast.error('Failed to load coupons. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, currentStatus) => {
        setLoading(true);
        try {
            const updatedStatus = !currentStatus;
            const res = await axios.put(`https://www.appapi.olyox.com/api/v1/parcel/update_parcel_coupon_status/${id}`, {
                isActive: updatedStatus,
            });
            toast.success(res?.data?.message);
            fetchCoupons();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCoupon = async (id) => {
        setLoading(true);
        try {
            const res = await axios.delete(`https://www.appapi.olyox.com/api/v1/parcel/parcel-coupon/${id}`);
            toast.success(res?.data?.message);
            fetchCoupons();
        } catch (error) {
            console.error('Error deleting coupon:', error);
            toast.error('Failed to delete coupon. Please try again.');
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
                handleDeleteCoupon(id);
            }
        });
    };

    React.useEffect(() => {
        fetchCoupons();
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = coupons.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(coupons.length / itemsPerPage);

    const handlePageChange = (page) => setCurrentPage(page);

    const heading = ['S.No', 'Code', 'Discount (%)', 'Expiration Date', 'Active', 'Action'];

    return (
        <>
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : (
                <Table
                    heading="All Coupons"
                    btnText="Add New Coupon"
                    btnURL="/add-parcel-coupon"
                    tableHeading={heading}
                    tableContent={currentData.map((item, index) => (
                        <CTableRow key={item._id}>
                            <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                            <CTableDataCell>{item.code}</CTableDataCell>
                            <CTableDataCell>{item.discount}%</CTableDataCell>
                            <CTableDataCell>{new Date(item.expirationDate).toLocaleDateString()}</CTableDataCell>
                            <CTableDataCell>
                                <CFormSwitch
                                    id={`formSwitch-${item._id}`}
                                    checked={item.isActive}
                                    onChange={() => handleUpdateStatus(item._id, item.isActive)}
                                />
                            </CTableDataCell>
                            <CTableDataCell>
                                <div className="action-parent">
                                    <CNavLink href={`#edit-parcel-coupon/${item._id}`} className="edit">
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

export default AllParcelCoupon;
