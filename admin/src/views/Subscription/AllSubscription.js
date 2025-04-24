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

const AllSubscription = () => {
    const [membershipPlans, setMembershipPlans] = React.useState([]); // Changed name to represent membership
    const [loading, setLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    const handleFetchMembershipPlans = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('api/v1/membership-plans');
            // const filteredData = data.data.filter(plan => plan.category === 'cab');
            setMembershipPlans(data.data.reverse() || []); // Ensure default empty array
        } catch (error) {
            console.error('Error fetching membership plans:', error);
            toast.error('Failed to load membership plans. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    // Update Active Status
    const handleUpdateActive = async (id, currentStatus) => {
        setLoading(true);
        try {
            const updatedStatus = !currentStatus;
            const res = await axios.put(`api/v1/update_membership_status/${id}`, {
                active: updatedStatus,
            });
            toast.success(res?.data?.message);
            handleFetchMembershipPlans();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(
                error?.response?.data?.errors?.[0] ||
                error?.response?.data?.message ||
                'Failed to update the status. Please try again.',
            );
        } finally {
            setLoading(false);
        }
    };

    // Delete Membership Plan
    const handleDeleteMembershipPlan = async (id) => {
        setLoading(true);
        try {
            const res = await axios.delete(`api/v1/membership-plans/${id}`);
            toast.success(res?.data?.message);
            handleFetchMembershipPlans();
        } catch (error) {
            console.error('Error deleting:', error);
            toast.error(
                error?.response?.data?.errors?.[0] ||
                error?.response?.data?.message ||
                'Internal server error',
            );
        } finally {
            setLoading(false);
        }
    };

    // Confirm Delete
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
                handleDeleteMembershipPlan(id);
            }
        });
    };

    React.useEffect(() => {
        handleFetchMembershipPlans();
    }, []);

    // Calculate paginated data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = membershipPlans.slice(startIndex, startIndex + itemsPerPage);

    // Calculate total pages
    const totalPages = Math.ceil(membershipPlans.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const heading = ['S.No', 'Title', 'Price', 'Level', 'Is Active', 'Action'];

    return (
        <>
            {loading ? (
                <div className="spin-style">
                    <CSpinner color="primary" variant="grow" />
                </div>
            ) : (
                <Table
                    heading="All Subscription"
                    btnText=""
                    btnURL=""
                    tableHeading={heading}
                    tableContent={currentData.map((item, index) => (
                        <CTableRow key={item._id}>
                            <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                            <CTableDataCell>{item.title}</CTableDataCell>
                            <CTableDataCell>{item.price} INR</CTableDataCell>
                            <CTableDataCell>{item.level}</CTableDataCell>
                            <CTableDataCell>
                                <CFormSwitch
                                    id={`formSwitch-${item._id}`}
                                    checked={item?.active}
                                    onChange={() => handleUpdateActive(item._id, item.active)}
                                />
                            </CTableDataCell>
                            <CTableDataCell>
                                <div className="action-parent">
                                    <CNavLink href={`#subscription/edit-cab/${item._id}`} className="edit">
                                        <i className="ri-pencil-fill"></i>
                                    </CNavLink>
                                    <div
                                        className="delete"
                                        onClick={() => confirmDelete(item._id)}
                                    >
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
}

export default AllSubscription
