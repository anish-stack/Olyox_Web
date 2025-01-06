import { useEffect, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";

function ManualRegister() {
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        number: '',
        password: '123456789',
        category: '',
        dob: '',
        referral_code_which_applied: 'BH445758',
        is_referral_applied: true,
        member_id: '6774f068d26e0d8a969fb8e3',
        myReferral: 'BH',
        plan_status: true,
        isActive: true
    });

    useEffect(() => {
        fetchCategory();
    }, []);

    const fetchCategory = async () => {
        try {
            const { data } = await axios.get('https://www.api.olyox.com/api/v1/categories_get');
            setCategory(data.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const res = await axios.post('https://www.api.olyox.com/api/v1/manual_register', formData);
            toast.success('Registration successful!');
            // setFormData({
            //     name: '',
            //     email: '',
            //     number: '',
            //     password: '123456789',
            //     category: '',
            //     dob: '',
            //     referral_code_which_applied: '',
            //     // is_referral_applied: false,
            //     member_id: '',
            //     myReferral: '',
            //     plan_status: true,
            //     isActive: true
            // });
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Manual Registration</h2>
                    <p className="mt-2 text-gray-600">Please fill in the details below</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div> */}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            >
                                <option value="">Select Category</option>
                                {category.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div> */}

                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700">Member ID</label>
                            <input
                                type="text"
                                name="member_id"
                                value={formData.member_id}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div> */}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">BH ID</label>
                            <input
                                type="text"
                                name="myReferral"
                                value={formData.myReferral}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Referral Code</label>
                            <input
                                type="text"
                                name="referral_code_which_applied"
                                value={formData.referral_code_which_applied}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>

                    {/* <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="is_referral_applied"
                            checked={formData.is_referral_applied}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            Apply Referral Code
                        </label>
                    </div> */}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ManualRegister;