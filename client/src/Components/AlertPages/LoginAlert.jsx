import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';

function LoginAlert() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center">
          <FiAlertCircle className="text-red-500 text-6xl mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6 text-center">
            You are not logged in. Please log in to access this page.
          </p>
          <Link
            to="/login"
            className="bg-red-500 text-white px-6 py-3 rounded-lg shadow hover:bg-red-600 transition duration-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginAlert;
