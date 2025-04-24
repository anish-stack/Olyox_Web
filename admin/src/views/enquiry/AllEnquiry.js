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

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await axios.get('api/v1/enquiries');

          setEnquiries(response.data.data);
          setFilteredEnquiries(response.data.data); // Set initial data as filtered data

      } catch (error) {
        console.error('Error fetching enquiries:', error);
      }
    };
    fetchEnquiries();
  }, []);

  // Filter function
  const filterEnquiries = () => {
    let filtered = enquiries;
    

    // Filter by name
    if (searchName) {
      filtered = filtered.filter((enquiry) =>
        enquiry.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filter by number (phone number or email, depending on use case)
    if (searchNumber) {
      filtered = filtered.filter(
        (enquiry) => enquiry.email.includes(searchNumber) // Searching by email for now
      );

    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter((enquiry) => new Date(enquiry.createdAt) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter((enquiry) => new Date(enquiry.createdAt) <= new Date(endDate));
    }

    setFilteredEnquiries(filtered);
  };

  // Handle change for filters
  const handleFilterChange = () => {
    filterEnquiries();
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">All Enquiries</h2>

      <div className="mb-4">
        <div className="row">
          {/* Search by Name */}
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>

          {/* Search by Number/Email */}
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Number/Email"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
            />
          </div>

          {/* Start Date Filter */}
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date Filter */}
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Apply Filters */}
          <div className="col-md-2">
            <button
              className="btn btn-primary w-100"
              onClick={handleFilterChange}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnquiries.length > 0 ? (
              filteredEnquiries.map((enquiry) => (
                <tr key={enquiry._id}>
                  <td>{enquiry.name}</td>
                  <td>{enquiry.email}</td>
                  <td>{enquiry.subject}</td>
                  <td>{enquiry.message}</td>
                  <td>{format(new Date(enquiry.createdAt), 'dd MMM yyyy')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllEnquiry;
