import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function ForgetPassword() {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    },[])
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        number: '',
        newPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Password length validation
        if (formData.newPassword.length < 8) {
            setLoading(false);
            setError('Password should be at least 8 characters long.');
            toast.error('Password should be at least 8 characters long.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:7000/api/v1/forget-password', formData);
            console.log(response.data)
            const { email, time } = response.data
            setLoading(false);
            if (response.data.success) {
                toast.success(response?.data?.message)
                window.location.href = `/otp-verify?type=password&email=${email}&expireTime=${time}`
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'An error occurred. Please try again.'
            );
            console.log("error", error)
            toast.error(error.response?.data?.message ||
                'An error occurred. Please try again.')
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-[#FFF4F4] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                        Change Your Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Secure your account by updating your password. Enter the details below to proceed with changing your password safely and quickly.
                    </p>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Number Field */}
                        <div>
                            <label
                                htmlFor="number"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Contact Number
                            </label>
                            <div className="mt-1">
                                <input
                                    id="number"
                                    name="number"
                                    type="text"
                                    autoComplete="number"
                                    required
                                    
                                    value={formData.number}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your Registered Number"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-gray-700"
                            >
                                New Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your New Password"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#D62D28] hover:bg-[#bd1d18] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            ) : (
                                'Change Your Password'
                            )}
                        </button>
                    </div>
                </form>

                {/* Sign Up Link */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-[#D62D28] hover:text-[#B02422]"
                        >
                            Sign in now
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default ForgetPassword;
