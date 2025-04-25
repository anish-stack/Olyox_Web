import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useParams } from 'react-router-dom';

function DoneRefer() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeLevelTab, setActiveLevelTab] = useState('Level1');
  useEffect(() => {
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          })
      },[])
  
  // Pagination state for each level
  const [pagination, setPagination] = useState({});
  const itemsPerPage = 10;

  const levels = ['Level1', 'Level2', 'Level3', 'Level4', 'Level5', 'Level6', 'Level7'];

  useEffect(() => {
    // Initialize pagination state for each level
    const initialPagination = levels.reduce((acc, level) => {
      acc[level] = { currentPage: 1 };
      return acc;
    }, {});
    setPagination(initialPagination);
  }, []);

  const fetchVendor = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://www.webapi.olyox.com/api/v1//get_Single_Provider/${id}`);
      setVendor(data.data);
    } catch (error) {
      
      setError('Failed to fetch referral data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const getVisibleLevels = () => {
    const higherLevel = vendor?.higherLevel || 7;
    return levels.slice(0, higherLevel);
  };

  const getPaginatedData = (levelData) => {
    if (!levelData) return [];
    const startIndex = (pagination[activeLevelTab]?.currentPage - 1) * itemsPerPage;
    return levelData.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = (levelData) => {
    return Math.ceil((levelData?.length || 0) / itemsPerPage);
  };

  const handlePageChange = (level, page) => {
    setPagination(prev => ({
      ...prev,
      [level]: { ...prev[level], currentPage: page }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-lg shadow-md">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700">Loading referrals...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Referral Dashboard
          </h1>
          <button
            onClick={fetchVendor}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh Data
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Level Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="flex border-b">
              {getVisibleLevels().map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveLevelTab(level)}
                  className={`
                    px-6 py-3 text-sm font-medium transition-colors duration-200
                    ${activeLevelTab === level
                      ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Level Content */}
        {getVisibleLevels().map((level) => (
          <div
            key={level}
            className={`${activeLevelTab === level ? 'block' : 'hidden'}`}
          >
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {level} Referrals
                </h2>
                
                {vendor?.[level]?.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BHID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getPaginatedData(vendor[level]).map((referral, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{referral?.myReferral}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{referral.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{referral.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{referral.number}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{referral?.category?.title}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {referral?.member_id?.title || 'Pending'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  referral?.plan_status
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {referral?.plan_status ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                             
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages(vendor[level]) > 1 && (
                      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex space-x-2">
                            {[...Array(totalPages(vendor[level]))].map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => handlePageChange(level, idx + 1)}
                                className={`px-3 py-1 rounded ${
                                  pagination[level]?.currentPage === idx + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {idx + 1}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No referrals available for {level}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoneRefer;