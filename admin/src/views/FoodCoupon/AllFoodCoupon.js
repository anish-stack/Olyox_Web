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

const AllFoodCoupon = () => {
  const [coupons, setCoupons] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/tiffin/tiffin-coupons');
      setCoupons(data.data.reverse() || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to load coupons. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    setLoading(true);
    try {
      const res = await axios.patch(`https://www.appapi.olyox.com/api/v1/tiffin/tiffin-coupons/toggle/${id}`);
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
      const res = await axios.delete(`https://www.appapi.olyox.com/api/v1/tiffin/tiffin-coupons/${id}`);
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

  const heading = [
    'S.No',
    'Title',
    'Coupon Code',
    'Min Order',
    'Max Discount',
    'Type',
    'Discount',
    'Active',
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
          heading="All Food Coupons"
          btnText="Add New Coupon"
          btnURL="/add-food-coupon"
          tableHeading={heading}
          tableContent={currentData.map((item, index) => (
            <CTableRow key={item._id}>
              <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
              <CTableDataCell>{item.title}</CTableDataCell>
              <CTableDataCell>{item.Coupon_Code}</CTableDataCell>
              <CTableDataCell>₹{item.min_order_amount}</CTableDataCell>
              <CTableDataCell>₹{item.max_discount}</CTableDataCell>
              <CTableDataCell>{item.discount_type}</CTableDataCell>
              <CTableDataCell>{item.discount}</CTableDataCell>
              <CTableDataCell>
                <CFormSwitch
                  id={`formSwitch-${item._id}`}
                  checked={item.active}
                  onChange={() => handleToggleStatus(item._id)}
                />
              </CTableDataCell>
              <CTableDataCell>
                <div className="action-parent">
                  <CNavLink href={`#/edit-food-coupon/${item._id}`} className="edit">
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

export default AllFoodCoupon;
