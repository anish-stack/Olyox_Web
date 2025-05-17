import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, ChevronLeft, ChevronRight, Filter, Loader2, Calendar as CalendarIcon } from 'lucide-react';

// Utility function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const RechargeHistory = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const [token, setToken] = useState('');
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [dateFilter, setDateFilter] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const tokenExtract = sessionStorage.getItem('token');
    if (tokenExtract) {
      setToken(tokenExtract);
      fetchPastRechargeDetails(tokenExtract);
    }
  }, []);

  useEffect(() => {
    filterRecords();
  }, [dateFilter, statusFilter, rechargeHistory]);

  const fetchPastRechargeDetails = async (token) => {
    try {
      setLoading(true);
      const { data } = await axios.get('https://webapi.olyox.com/api/v1/get-recharge', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Recharge data:', data.data);
      setRechargeHistory(data.data);
      setFilteredHistory(data.data);
    } catch (error) {
      console.error('Error fetching recharge history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = [...rechargeHistory];

    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.end_date).toISOString().split('T')[0];
        return recordDate === dateFilter;
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      const isApproved = statusFilter === 'approved';
      filtered = filtered.filter((record) => record.payment_approved === isApproved);
    }

    setFilteredHistory(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setDateFilter('');
    setStatusFilter('all');
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredHistory.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredHistory.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Recharge History</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              className="border rounded-md px-3 py-2 w-full"
              value={recordsPerPage}
              onChange={(e) => setRecordsPerPage(Number(e.target.value))}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              className="border rounded-md px-3 py-2 w-full"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by date"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-5 h-5 text-gray-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </span>
            <select
              className="border rounded-md px-3 py-2 w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {filteredHistory.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRecords.map((record, index) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {indexOfFirstRecord + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {record.member_id?.title || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {record.member_id?.description || 'No description available'}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Validity: {record.member_id?.validityDays || 'N/A'} days
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₹ {record.amount?.toFixed(2) || '0.00'}
                        {record.isCouponApplied && (
                          <div className="text-xs text-green-600 mt-1">
                            Coupon applied: {record.couponCode || 'N/A'}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(record.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(record.end_date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-mono text-xs">{record.trn_no || 'N/A'}</div>
                        <div className="text-xs text-gray-500 mt-1">{record.razorpay_status || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${record.payment_approved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {record.payment_approved ? 'Approved' : 'Pending'}
                        </span>
                        {record.isCancelPayment && (
                          <span className="px-2 py-1 mt-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Cancelled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between mt-6">
              <div className="text-sm text-gray-700 mb-4 md:mb-0">
                Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredHistory.length)} of{' '}
                {filteredHistory.length} results
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {totalPages <= 5 ? (
                  Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 rounded-md ${currentPage === number
                          ? 'bg-blue-500 text-white'
                          : 'border hover:bg-gray-50'
                        }`}
                    >
                      {number}
                    </button>
                  ))
                ) : (
                  <>
                    {currentPage > 2 && (
                      <button
                        onClick={() => paginate(1)}
                        className="px-3 py-1 rounded-md border hover:bg-gray-50"
                      >
                        1
                      </button>
                    )}

                    {currentPage > 3 && <span className="px-2">...</span>}

                    {currentPage > 1 && (
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        className="px-3 py-1 rounded-md border hover:bg-gray-50"
                      >
                        {currentPage - 1}
                      </button>
                    )}

                    <button
                      className="px-3 py-1 rounded-md bg-blue-500 text-white"
                    >
                      {currentPage}
                    </button>

                    {currentPage < totalPages && (
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        className="px-3 py-1 rounded-md border hover:bg-gray-50"
                      >
                        {currentPage + 1}
                      </button>
                    )}

                    {currentPage < totalPages - 2 && <span className="px-2">...</span>}

                    {currentPage < totalPages - 1 && (
                      <button
                        onClick={() => paginate(totalPages)}
                        className="px-3 py-1 rounded-md border hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    )}
                  </>
                )}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
            <div className="text-gray-500 mb-2">No recharge history found</div>
            {(dateFilter || statusFilter !== 'all') && (
              <button
                onClick={resetFilters}
                className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RechargeHistory;