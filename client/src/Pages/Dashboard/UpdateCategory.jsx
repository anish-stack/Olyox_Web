import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';

function UpdateCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const SessionData = sessionStorage.getItem('user');
    const Provider = JSON.parse(SessionData);
    const providerId = Provider._id;
    const [formData, setFormData] = useState({
        category: ''
    });

    const fetchCategory = async () => {
        try {
            const { data } = await axios.get('http://localhost:7000/api/v1/categories_get');
            setCategories(data.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const fetchProvider = async () => {
        try {
            const { data } = await axios.get(`http://localhost:7000/api/v1/get_Single_Provider/${providerId}`);
            const allData = data.data;
            setFormData({
                category: allData.category._id || '',
            });

        } catch (error) {
            console.log("Internal server error", error);
            toast.error(error?.response?.data?.message || 'Internal server error');
        }
    };

    useEffect(() => {
        fetchCategory();
        fetchProvider();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.put(`http://localhost:7000/api/v1/update_account/${providerId}`, formData);
            toast.success('Category updated successfully');
            window.location.href="/Dashboard"
        } catch (error) {
            console.log("Internal server error", error);
            toast.error(error.response?.data?.message || 'Failed to update category');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <FiLoader className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Update Category</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Dropdown */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Select Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="block w-full mt-1 p-3 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="" disabled>
                                -- Select a Category --
                            </option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.title}
                                </option>
                            ))}
                        </select>

                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={submitting || !formData.category}
                            className="w-full py-3 px-6 bg-[#DA2D29] text-white font-semibold rounded-lg hover:bg-[#DA2D29] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <FiLoader className="animate-spin h-5 w-5" />
                            ) : (
                                <FiCheckCircle className="h-5 w-5" />
                            )}
                            {submitting ? 'Updating...' : 'Update Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateCategory;
