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

function AllCategory() {
    const [category, setCategory] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    const handleFetchBanner = async () => {
        setLoading(true);
        
        try {
            const { data } = await axios.get('https://www.api.olyox.com/api/v1/categories_get');
            setCategory(data.data || []); // Ensure default empty array
        } catch (error) {
            console.error('Error fetching blogs:', error);
            toast.error('Failed to load blogs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Update Active Status
    const handleUpdateActive = async (id, currentStatus) => {
        setLoading(true);
        try {
            const updatedStatus = !currentStatus;
            const res = await axios.put(`https://www.api.olyox.com/api/v1/update_category_status/${id}`, {
                isActive: updatedStatus,
            });
            toast.success(res?.data?.message);
            handleFetchBanner()
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

    // Delete Banner
    const handleDeleteBanner = async (id) => {
        setLoading(true);
        try {
            const res = await axios.delete(`https://www.api.olyox.com/api/v1/categories/${id}`);
            toast.success(res?.data?.message);
            handleFetchBanner();
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
                handleDeleteBanner(id);
            }
        });
    };

    React.useEffect(() => {
        handleFetchBanner();
    }, []);

    // Calculate paginated data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = category.slice(startIndex, startIndex + itemsPerPage);

    // Calculate total pages
    const totalPages = Math.ceil(category.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const heading = ['S.No', 'Icon', 'Title', 'Is Active', 'Action'];

    return (
        <>
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
                    heading="All Category"
                    btnText="Add Category"
                    btnURL="/category/add-category"
                    tableHeading={heading}
                    tableContent={
                        currentData.map((item, index) => (
                            <CTableRow key={item._id}>
                                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                                <CTableDataCell>
                                    <img src={item.icon} alt="icon" width={50} height={50} />
                                </CTableDataCell>
                                <CTableDataCell>{item.title}</CTableDataCell>
                                <CTableDataCell>
                                    <CFormSwitch
                                        id={`formSwitch-${item._id}`}
                                        checked={item?.isActive}
                                        onChange={() =>
                                            handleUpdateActive(item._id, item.isActive)
                                        }
                                    />
                                </CTableDataCell>
                                <CTableDataCell>
                                    <div className="action-parent">
                                        <CNavLink href={`#/category/edit-category/${item._id}`} className='edit'>
                                            <i class="ri-pencil-fill"></i>
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
        </>
    );
}

export default AllCategory
