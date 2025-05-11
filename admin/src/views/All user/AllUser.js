import React, { useState, useEffect } from 'react';
import {
    CTableDataCell,
    CTableRow,
    CSpinner,
    CPagination,
    CPaginationItem,
    CButton,
    CInputGroup,
    CInputGroupText,
    CFormInput,
} from '@coreui/react';
import { FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AllUser = () => {
  const [users, setUsers] = useState([]); // Renamed to 'users' as per the model
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const itemsPerPage = 10; 


  const fetchUsers = async () => {
      setLoading(true);
      try {
          const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/user/get_all_user');
          const reverceDAta = data.data.reverse();
          setUsers(Array.isArray(reverceDAta) ? reverceDAta : []);
      } catch (error) {
          console.error('Error fetching users:', error);
          toast.error('Failed to load users. Please try again.');
          setUsers([]);
      } finally {
          setLoading(false);
      }
  };
  

  const handleStatusToggle = async (userId, currentStatus) => {
      setLoading(true);
      try {
          await axios.put(`https://www.appapi.olyox.com/api/v1/user/update_user_block/${userId}`, {
              isBlock: !currentStatus, // Field name adjusted based on model
          });
          toast.success('Status updated successfully!');
          fetchUsers();
      } catch (error) {
          console.error('Error updating status:', error);
          toast.error('Failed to update user status. Please try again.');
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchUsers();
  }, []);

  // Filter users based on name, email, or number
  const filteredUsers = users.filter(user => {
      return (
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (page) => {
      setCurrentPage(page);
  };

  const handleViewDetails = (userId) => {
      navigate(`/cab/vendor-detail/${userId}`);
  };

  const heading = ['S.No', 'User Name', 'Email', 'Number', 'Join At','OTP Verified', 'Block'];

  return (
      <>
          <div className="filter-container mb-3">
              <CInputGroup>
                  <CInputGroupText>Search</CInputGroupText>
                  <CFormInput
                      placeholder="Search by Name, Email or Number"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
              </CInputGroup>
          </div>
          {loading ? (
              <div className="spin-style">
                  <CSpinner color="primary" variant="grow" />
              </div>
          ) : filteredUsers.length === 0 ? (
              <div className="no-data">
                  <p>No users available</p>
              </div>
          ) : (
              <Table
                  heading="Users"
                  btnText=""
                  btnURL="/add-user"
                  tableHeading={heading}
                  tableContent={
                      currentData.map((user, index) => (
                          <CTableRow key={user._id}>
                              <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
                              <CTableDataCell>{user.name || 'N/A'}</CTableDataCell>
                              <CTableDataCell>{user.email || 'N/A'}</CTableDataCell>
                              <CTableDataCell>{user.number || 'N/A'}</CTableDataCell>
<CTableDataCell>
  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : 'N/A'}
</CTableDataCell>
                              <CTableDataCell>{user.isOtpVerify ? 'Yes' : 'No'}</CTableDataCell>
                              <CTableDataCell>
                                  <CButton
                                      color={user.isBlock ? 'danger' : 'success'}
                                      size="sm"
                                      className="d-flex align-items-center gap-2"
                                      onClick={() => handleStatusToggle(user._id, user.isBlock)}
                                  >
                                      {user.isBlock ? <FaToggleOn /> : <FaToggleOff />}
                                      {user.isBlock ? 'Block' : 'Unblock'}
                                  </CButton>
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
};

export default AllUser;
