import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter, Loader2, UserCheck, UserX, RefreshCcw, Calendar } from 'lucide-react';

const AllReferral = () => {
  const [referrals, setReferrals] = useState([]);
  const [filteredReferrals, setFilteredReferrals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  useEffect(() => {
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          })
      },[])

  const fetchReferrals = async () => {
    setLoading(true);
    setError('');
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get('http://localhost:7000/api/v1/get-my-referral', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReferrals(response.data.data);
      setFilteredReferrals(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch referrals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  useEffect(() => {
    let result = [...referrals];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(referral =>
        referral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.contactNumber.includes(searchTerm) ||
        referral.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(referral =>
        filterStatus === 'registered' ? referral.isRegistered : !referral.isRegistered
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

    setFilteredReferrals(result);
    setCurrentPage(1);
  }, [searchTerm, filterStatus, sortBy, referrals]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReferrals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReferrals.length / itemsPerPage);

  const handleRefresh = () => {
    fetchReferrals();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2 text-blue-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg font-medium">Loading referrals...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          All Referrals
        </h1>
        <button
          onClick={handleRefresh}
          className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, number, or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="registered">Registered</option>
            <option value="unregistered">Unregistered</option>
          </select>
        </div>

        {/* Sort */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Cards Grid */}
      {currentItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No referrals found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((referral) => (
            <div
              key={referral._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{referral.name}</h2>
                  {referral.isRegistered ? (
                    <UserCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <UserX className="w-5 h-5 text-red-500" />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium w-32">Contact:</span>
                    <span>{referral.contactNumber}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <span className="font-medium w-32">State:</span>
                    <span>{referral.state}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <span className="font-medium w-32">Recharge:</span>
                    <span className={referral.isRecharge ? 'text-green-600' : 'text-red-600'}>
                      {referral.isRecharge ? 'First recharge Completed' : 'First recharge Not Completed'}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <span className="font-medium w-32">Created:</span>
                    <span>{new Date(referral.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {!referral.isRegistered && (
                  <div className="mt-4 py-2 px-3 bg-yellow-50 rounded-lg">
                    <p className="text-yellow-700 text-sm">
                      This referral is not registered yet.
                    </p>
                  </div>
                )}
                {referral.isRegistered && !referral.isRecharge && (
                  <div className="mt-4 py-2 px-3 bg-green-200 rounded-lg">
                    <p className="text-gray-900 text-sm">
                      This referral has registered but has not completed their first recharge yet.
                    </p>

                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllReferral;