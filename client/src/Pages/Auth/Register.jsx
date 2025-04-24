import { useEffect, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";

const Register = () => {

    const location = new URLSearchParams(window.location.search)
    const bh_id = location.get('bh_id') || null

    const [isBhverify, setIsverify] = useState(false)



    const [formData, setFormData] = useState({
        name: '',
        // VehicleNumber: '',
        email: '',
        reEmail: '',
        number: '',
        password: '',
        category: '',
        address: {
            area: '',
            street_address: '',
            landmark: '',
            pincode: '',
            location: {
                type: '',
                coordinates: [78.2693, 25.369]
            }
        },
        dob: null,
        // aadharNumber: 'ssssssss',
        // panNumber: 'ssssssssss',
        referral_code_which_applied: '',
        is_referral_applied: false,
        member_id: '',
        imageone: null,
        imageTwo: null,
        imageThree: null,

    });




    const checkBhId = async () => {
        try {

            const { data } = await axios.post('api/v1/check-bh-id', { bh: bh_id });
            const status = data.success
            if (status) {
                setIsverify(true)
            } else {
                setIsverify(false)
            }
        } catch (err) {
            console.log(err)
            setIsverify(false)

        }
    };

    useEffect(() => {
        checkBhId()
    }, [bh_id])

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchCategory();

    }, []);

    useEffect(() => {
        if (bh_id) {
            setFormData((prev) => ({
                ...prev,
                referral_code_which_applied: bh_id,
                is_referral_applied: true
            }))
        }
    }, [bh_id])

    const validateForm = () => {
        const newErrors = {};
        const currentDate = new Date();
        if (!formData.name.trim()) newErrors.name = 'Please enter your name.';
        if (!formData.dob) {
            newErrors.dob = 'Please enter your date of birth.';
        } else {
            const dobDate = new Date(formData.dob);
            const age = currentDate.getFullYear() - dobDate.getFullYear();
            const isBeforeBirthday = currentDate < new Date(dobDate.setFullYear(currentDate.getFullYear()));

            if (age < 18 || (age === 18 && isBeforeBirthday)) {
                newErrors.dob = 'You must be at least 18 years old.';
            }
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Please provide your email address.';
        }
        if (!formData.reEmail.trim()) {
            newErrors.reEmail = 'Please provide your Re-Enter Email address.';
        } else if (formData.email.trim() && formData.email !== formData.reEmail) {
            newErrors.reEmail = 'Email does not match.';
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address (e.g., user@example.com).';
        if (!formData.number.trim()) newErrors.number = 'Please enter your phone number.';
        if (!/^\d{10}$/.test(formData.number)) newErrors.number = 'Phone number must be exactly 10 digits.';
        if (!formData.password.trim()) newErrors.password = 'Please create a password.';
        if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long.';
        if (!formData.category) newErrors.category = 'Please select a category.';
        if (!formData.address.pincode.trim()) newErrors.pincode = 'Please enter your area pincode.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSelect = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const fetchAddressSuggestions = async (query) => {
        if (!query.trim()) return;
        try {
            const res = await axios.get(`https://api.blueaceindia.com/api/v1/autocomplete?input=${encodeURIComponent(query)}`);
            setAddressSuggestions(res.data);
        } catch (err) {
            console.error('Error fetching address suggestions:', err);
        }
    };

    const fetchGeocode = async (selectedAddress) => {
        try {
            const res = await axios.get(`https://api.blueaceindia.com/api/v1/geocode?address=${encodeURIComponent(selectedAddress?.description)}`);
            const { latitude, longitude } = res.data;
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    location: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    }
                }
            }));
        } catch (err) {
            console.error('Error fetching geocode:', err);
        }
    };

    const handleFileUpload = (e) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        }
    };

    const fetchCategory = async () => {
        try {
            const { data } = await axios.get('api/v1/categories_get');
            setCategories(data.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        console.log('Registration succesful:', formData);

        setSubmitting(true);
        const updatedData = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'address') {
                Object.entries(value).forEach(([addressKey, addressValue]) => {
                    if (addressKey === 'location') {
                        updatedData.append(`address[${addressKey}][type]`, addressValue.type);
                        updatedData.append(`address[${addressKey}][coordinates]`, JSON.stringify(addressValue.coordinates));
                    } else {
                        updatedData.append(`address[${addressKey}]`, addressValue);
                    }
                });
            } else if (key === 'aadharfront' || key === 'aadharback' || key === 'pancard') {
                if (value) {
                    updatedData.append(key, value);
                }
            } else {
                updatedData.append(key, value);
            }
        });

        try {
            const response = await axios.post('api/v1/register_vendor', updatedData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // console.log('Registration successful:', response.data);
            toast.success(response.data.message || 'Registration successful');
            if (response.data?.success) {
                window.location.href = `/otp-verify?type=${response.data?.type}&email=${response?.data?.email}&expireTime=${response?.data?.time}&number=${response?.data?.number}`;
            }
            // Reset form or redirect here

        } catch (error) {
            console.log(error)
            const errorMessage = error.response.data.message || error.response.data
            toast.error(errorMessage)

        } finally {
            setSubmitting(false);
        }
    };

    if (!isBhverify) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm text-center">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                        Verification Failed
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        The BH ID you provided is either not active or unavailable. Please contact support for assistance.
                    </p>
                    <button
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={() => window.location.href = '/support'}
                    >
                        Contact Support
                    </button>
                </div>
            </div>
        );
    }


    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl">
                <div className="px-8 py-6 border-b border-gray-200">
                    <h2 className="text-3xl font-bold text-gray-900 text-center">Vendor Registration</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Name and Email Row */}
                    <div className="bg-gray-50 px-3 pt-2">
                        <h4 className="text-xl text-gray-900 font-bold">Basic Information</h4>
                        <div className="grid py-5  px-3 grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name as Per Aadhaar Card</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                        } px-3 py-2 border`}
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div>
                                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">DOB</label>
                                <input
                                    type="date"
                                    id="dob"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.dob ? 'border-red-500' : 'border-gray-300'
                                        } px-3 py-2 border`}
                                />
                                {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        } px-3 py-2 border`}
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="reemail" className="block text-sm font-medium text-gray-700">Re-Enter Email</label>
                                <input
                                    type="email"
                                    id="reEmail"
                                    name="reEmail"
                                    value={formData.reEmail}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        } px-3 py-2 border`}
                                />
                                {errors.reEmail && <p className="mt-1 text-sm text-red-600">{errors.reEmail}</p>}
                            </div>
                            <div>
                                <label htmlFor="number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    id="number"
                                    name="number"
                                    value={formData.number}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.number ? 'border-red-500' : 'border-gray-300'
                                        } px-3 py-2 border`}
                                />
                                {errors.number && <p className="mt-1 text-sm text-red-600">{errors.number}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        } px-3 py-2 border`}
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                        <h4 className="text-xl text-gray-900 font-bold">Address Details</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="address.area" className="block text-sm font-medium text-gray-700">Area</label>
                                <input
                                    type="text"
                                    id="address.area"
                                    name="address.area"
                                    value={formData.address.area}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                                />
                            </div>

                            <div>
                                <label htmlFor="address.street_address" className="block text-sm font-medium text-gray-700">Street Address</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="address.street_address"
                                        name="address.street_address"
                                        value={formData.address.street_address}
                                        onChange={(e) => {
                                            handleChange(e);
                                            fetchAddressSuggestions(e.target.value);
                                        }}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                                    />
                                    {addressSuggestions.length > 0 && (
                                        <ul className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
                                            {addressSuggestions.map((suggestion, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            address: {
                                                                ...prev.address,
                                                                street_address: suggestion?.description
                                                            }
                                                        }));
                                                        fetchGeocode(suggestion);
                                                        setAddressSuggestions([]);
                                                    }}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {suggestion?.description}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="address.landmark" className="block text-sm font-medium text-gray-700">Landmark</label>
                                <input
                                    type="text"
                                    id="address.landmark"
                                    name="address.landmark"
                                    value={formData.address.landmark}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                                />
                            </div>

                            <div>
                                <label htmlFor="address.pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                                <input
                                    type="text"
                                    id="address.pincode"
                                    name="address.pincode"
                                    value={formData.address.pincode}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.pincode ? 'border-red-500' : 'border-gray-300'
                                        } px-3 py-2 border`}
                                />
                                {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
                            </div>



                        </div>
                    </div>

                    {/* Phone and Password Row */}
                    <div className="bg-gray-50 p-3 rounded-lg space-y-6">
                        <h4 className="text-xl font-bold text-gray-900">Other Important Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">


                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleSelect}
                                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.category ? 'border-red-500' : 'border-gray-300'
                                        } px-3 py-2 border`}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category._id}>{category.title}</option>
                                    ))}
                                </select>
                                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="aadharfront" className="block text-sm font-medium text-gray-700">Aadhaar Front</label>
                                <input
                                    type="file"
                                    id="aadharfront"
                                    name="aadharfront"
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                    className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
                                />
                            </div>

                            <div>
                                <label htmlFor="aadharback" className="block text-sm font-medium text-gray-700">Aadhaar Back</label>
                                <input
                                    type="file"
                                    id="aadharback"
                                    name="aadharback"
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                    className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
                                />
                            </div>

                            <div>
                                <label htmlFor="pancard" className="block text-sm font-medium text-gray-700">Pan Card</label>
                                <input
                                    type="file"
                                    id="pancard"
                                    name="pancard"
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                    className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
                                />
                            </div>
                        </div>
                    </div>




                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;