import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiLock, FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';

function UpdatePassword() {
    const SessionData = sessionStorage.getItem('user');
    const Provider = JSON.parse(SessionData);
    const Email = Provider?.email;
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        email: Email
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        },[])

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('New passwords do not match!');
            return;
        }

        if (formData.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            await axios.post(`https://www.webapi.olyox.com/api/v1//change_Vendor_Password`, {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
                email: formData.email
            });
            toast.success('Password updated successfully!');
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '', email: Email });
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Update Password</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Old Password */}
                    <div>
                        <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                            Old Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="oldPassword"
                                id="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                className="block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <FiLock className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="newPassword"
                                id="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="block w-full p-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <FiLock className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3 px-6 bg-[#DA2D29] text-white font-semibold rounded-lg hover:bg-[#DA2D29] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <FiLoader className="animate-spin mr-2" /> Updating...
                                </>
                            ) : (
                                'Update Password'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdatePassword;
