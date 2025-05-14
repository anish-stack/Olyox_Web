import React, { useState, useEffect } from 'react';
import {
  CTableDataCell,
  CTableRow,
  CSpinner,
  CPagination,
  CPaginationItem,
  CFormSwitch,
  CNavLink,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const AllBonusCoupon = () => {
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [visible, setVisible] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);

  const fetchBonuses = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/admin/admin/bonuses');
      setBonuses(data.data.reverse() || []);
    } catch (error) {
      console.error('Error fetching bonuses:', error);
      toast.error('Failed to load bonuses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
  setLoading(true);
  try {
    const updatedStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await axios.put(`https://www.appapi.olyox.com/api/v1/admin/admin/update_bonus_status/${id}`, {
      bonusStatus: updatedStatus,
    });
    toast.success(`Bonus ${updatedStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
    fetchBonuses();
  } catch (error) {
    console.error('Error updating bonus status:', error);
    toast.error('Failed to update status. Please try again.');
  } finally {
    setLoading(false);
  }
};


  const handleDeleteBonus = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(`https://www.appapi.olyox.com/api/v1/admin/admin/bonuses/${id}`);
      toast.success(res?.data?.message || 'Bonus deleted successfully');
      fetchBonuses();
    } catch (error) {
      console.error('Error deleting bonus:', error);
      toast.error('Failed to delete bonus. Please try again.');
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
        handleDeleteBonus(id);
      }
    });
  };

  const openConditions = (fields) => {
    setSelectedFields(fields || []);
    setVisible(true);
  };

  useEffect(() => {
    fetchBonuses();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = bonuses.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(bonuses.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  const heading = [
    'S.No',
    'Coupon Code',
    'Bonus Type',
    'Bonus Value',
    'Required Hours',
    'Conditions',
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
        <>
          <Table
            heading="All Bonus Coupons"
            btnText="Add New Bonus"
            btnURL="/add-bonus-coupon"
            tableHeading={heading}
            tableContent={currentData.map((item, index) => (
              <CTableRow key={item._id}>
                <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                <CTableDataCell>{item.bonusCouponCode || '-'}</CTableDataCell>
                <CTableDataCell>{item.bonusType}</CTableDataCell>
                <CTableDataCell>
                  {item.bonusType === 'percentage'
                    ? `${item.bonusValue}%`
                    : `₹${item.bonusValue}`}
                </CTableDataCell>
                <CTableDataCell>{item.requiredHours} hrs</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="info"
                    size="sm"
                    onClick={() => openConditions(item.any_required_field)}
                  >
                    View
                  </CButton>
                </CTableDataCell>
                <CTableDataCell>
                  <CFormSwitch
                    id={`formSwitch-${item._id}`}
                    checked={item.bonusStatus === 'active'}
                    onChange={() => handleUpdateStatus(item._id, item.bonusStatus)}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  {new Date(item.createdAt).toLocaleDateString()}
                </CTableDataCell>
                <CTableDataCell>
                  <div className="action-parent">
                    <CNavLink href={`#edit-bonus-coupon/${item._id}`} className="edit">
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
          
          {/* Modal to show conditions */}
          <CModal visible={visible} onClose={() => setVisible(false)}>
            <CModalHeader closeButton>Bonus Conditions</CModalHeader>
            <CModalBody>
              {selectedFields.length > 0 ? (
                <ul>
                  {selectedFields.map((field, idx) => (
                    <li key={idx}>{field}</li>
                  ))}
                </ul>
              ) : (
                <p>No conditions available.</p>
              )}
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setVisible(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
        </>
      )}
    </>
  );
};

export default AllBonusCoupon;
