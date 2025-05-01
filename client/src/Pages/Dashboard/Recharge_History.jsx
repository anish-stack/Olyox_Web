import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, ChevronLeft, ChevronRight, Filter, Loader2 } from 'lucide-react';
import { formatDate } from './formData';

const RechargeHistory = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])
  const [token, setToken] = useState('');
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [dateFilter, setDateFilter] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);

  useEffect(() => {
    const tokenExtract = sessionStorage.getItem('token');
    if (tokenExtract) {
      setToken(tokenExtract);
      fetchPastRechargeDetails(tokenExtract);
    }
  }, []);

  useEffect(() => {
    filterRecords();
  }, [dateFilter, rechargeHistory]);

  const fetchPastRechargeDetails = async (authToken) => {
    try {
      setLoading(true);
      const { data } = await axios.get('https://www.webapi.olyox.com/api/v1/get-recharge', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setRechargeHistory(data.data);
      setFilteredHistory(data.data);
    } catch (error) {
      console.error('Error fetching recharge history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    if (!dateFilter) {
      setFilteredHistory(rechargeHistory);
      return;
    }

    const filtered = rechargeHistory.filter((record) => {
      const recordDate = new Date(record.end_date).toISOString().split('T')[0];
      return recordDate === dateFilter;
    });
    setFilteredHistory(filtered);
    setCurrentPage(1);
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
      <div className="bg-white rounded-lg  p-6">
        <h1 className="text-2xl font-bold mb-6">Recharge History</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              className="border rounded-md px-3 py-2"
              value={recordsPerPage}
              onChange={(e) => setRecordsPerPage(Number(e.target.value))}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              className="border rounded-md px-3 py-2"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
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
                  End Date
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recharge Date
                </th> */}
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
                      {record.member_id.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {record.member_id.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    Rs {record.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(record.end_date)}
                  </td>
                  {/* <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(record.st)}
                  </td> */}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.trn_no}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.payment_approved
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {record.payment_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredHistory.length)} of{' '}
            {filteredHistory.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
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
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargeHistory;
