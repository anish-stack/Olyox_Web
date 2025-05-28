import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const AllEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchNumber, setSearchNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const enquiriesPerPage = 10;

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await axios.get('https://www.webapi.olyox.com/api/v1/enquiries');
        setEnquiries(response.data.data);
        setFilteredEnquiries(response.data.data);
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      }
    };
    fetchEnquiries();
  }, []);

  const filterEnquiries = () => {
    let filtered = enquiries;

    if (searchName) {
      filtered = filtered.filter((enquiry) =>
        enquiry.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchNumber) {
      filtered = filtered.filter(
        (enquiry) => enquiry.email.includes(searchNumber)
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (enquiry) => new Date(enquiry.createdAt) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (enquiry) => new Date(enquiry.createdAt) <= new Date(endDate)
      );
    }

    setFilteredEnquiries(filtered);
    setCurrentPage(1); // Reset to page 1 after filter
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await axios.delete(`https://www.webapi.olyox.com/api/v1/enquiries/${id}`);
      const updated = enquiries.filter((enquiry) => enquiry._id !== id);
      setEnquiries(updated);
      setFilteredEnquiries(updated);
    } catch (error) {
      console.error('Error deleting enquiry:', error);
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * enquiriesPerPage;
  const indexOfFirst = indexOfLast - enquiriesPerPage;
  const currentEnquiries = filteredEnquiries.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEnquiries.length / enquiriesPerPage);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">All Enquiries</h2>

      {/* Filters */}
      <div className="mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Email"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-primary w-100"
              onClick={filterEnquiries}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>S.No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentEnquiries.length > 0 ? (
              currentEnquiries.map((enquiry, index) => (
                <tr key={enquiry._id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{enquiry.name}</td>
                  <td>{enquiry.email}</td>
                  <td>{enquiry.subject}</td>
                  <td>{enquiry.message}</td>
                  <td>{format(new Date(enquiry.createdAt), 'dd MMM yyyy')}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(enquiry._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <nav>
            <ul className="pagination">
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AllEnquiry;
