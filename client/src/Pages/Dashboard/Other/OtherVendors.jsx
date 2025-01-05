import React, { useEffect, useState } from "react";
import axios from "axios";

const OtherVendors = () => {
  const location = new URLSearchParams(window.location.search);
  const vendorId = location.get("id");

  const [vendorData, setVendorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await axios.get(
          `https://api.olyox.com/api/v1/get_Copy_Provider/${vendorId}`
        );
        if (response.data.success) {
          setVendorData(response.data.data);
        } else {
          setError("Vendor not found.");
        }
      } catch (err) {
        setError("An error occurred while fetching the vendor data.");
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      fetchVendorData();
    } else {
      setError("Invalid vendor ID.");
      setLoading(false);
    }
  }, [vendorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-xl font-semibold text-gray-600">
          Loading vendors...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Vendor Directory
        </h1>
        
        {vendorData.length === 0 ? (
          <div className="text-center bg-white rounded-xl shadow-sm p-8">
            <p className="text-gray-500 text-lg">No vendors available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendorData.map((vendor) => (
              <div 
                key={vendor._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {vendor.name}
                    </h2>
                    <span 
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        vendor.plan_status 
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {vendor.plan_status ? "Active" : "Inactive"}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <svg 
                        className="w-5 h-5 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {vendor.email}
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <svg 
                        className="w-5 h-5 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {vendor.number}
                    </div>
                    <div className="flex items-center text-gray-600">
                     BHID: 
                      {vendor.myReferral}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img
                        src={vendor.category.icon}
                        alt={vendor.category.title}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium text-gray-900">
                          {vendor.category.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherVendors;