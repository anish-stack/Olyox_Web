import React, { useState, useEffect } from 'react';
import {
  CTableDataCell,
  CTableRow,
  CSpinner,
  CPagination,
  CPaginationItem,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
  CFormSwitch
} from '@coreui/react';
import Table from '../../components/Table/Table';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AllHomeBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('https://www.appapi.olyox.com/api/v1/admin/get_home_banners');
      setBanners(Array.isArray(data.data) ? data.data.reverse() : []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Failed to load banners. Please try again.');
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://www.appapi.olyox.com/api/v1/admin/delete_home_banner/${id}`);
      toast.success('Banner deleted successfully');
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Failed to delete banner. Please try again.');
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(`https://www.appapi.olyox.com/api/v1/admin/toggle_home_banner/${id}`);
      toast.success('Banner status updated');
      fetchBanners();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status. Please try again.');
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const filteredBanners = banners.filter(banner =>
    banner?.image?.url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredBanners.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const heading = ['S.No', 'Image', 'Active Status', 'Actions'];

  return (
    <>
      <div className="filter-container mb-3">
        <CInputGroup>
          <CInputGroupText>Search</CInputGroupText>
          <CFormInput
            placeholder="Search by Image URL"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CInputGroup>
      </div>

      {loading ? (
        <div className="spin-style">
          <CSpinner color="primary" variant="grow" />
        </div>
      ) : (
        <Table
          heading="Home Banners"
          btnText="Add Home Banner"
          btnURL="/add-home-banner"
          tableHeading={heading}
          tableContent={currentData.map((banner, index) => (
            <CTableRow key={banner._id}>
              <CTableDataCell>{startIndex + index + 1}</CTableDataCell>
              <CTableDataCell>
                <img
                  src={banner.image?.url}
                  alt="Banner"
                  width={80}
                  height={50}
                  style={{ objectFit: 'cover', borderRadius: '5px' }}
                />
              </CTableDataCell>
              <CTableDataCell>
                <CFormSwitch
                  checked={banner.is_active}
                  onChange={() => toggleStatus(banner._id)}
                  label={banner.is_active ? 'Active' : 'Inactive'}
                />
              </CTableDataCell>
              <CTableDataCell>
                <CButton color="danger" size="sm" onClick={() => handleDelete(banner._id)}>
                  Delete
                </CButton>
                <CButton color="primary" size="sm" onClick={() => navigate(`/edit-home-banner/${banner._id}`)} className="ms-2">
                  Update
                </CButton>
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

export default AllHomeBanner;
