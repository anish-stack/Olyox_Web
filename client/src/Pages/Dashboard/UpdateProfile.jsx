import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiTruck } from 'react-icons/fi';

function UpdateProfile() {
    const [loading, setLoading] = useState(false);
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const SessionData = sessionStorage.getItem('user');
    const Provider = JSON.parse(SessionData);
    const providerId = Provider._id;
    const [category, setCategory] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        number: '',
        address: {
            area: '',
            street_address: '',
            landmark: '',
            location: {
                type: 'Point',
                coordinates: []
            },
            pincode: ''
        },
        VehicleNumber: ''
    });

    const fetchProvider = async () => {
        try {
            const { data } = await axios.get(`https://apiking.digital4now.in/api/v1/get_Single_Provider/${providerId}`,{
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const allData = data.data;
            setCategory(allData?.category?._id)
            setFormData({
                name: allData.name || '',
                email: allData.email || '',
                number: allData.number || '',
                address: {
                    area: allData.address?.area || '',
                    street_address: allData.address?.street_address || '',
                    landmark: allData.address?.landmark || '',
                    location: {
                        type: 'Point',
                        coordinates: allData.address?.location?.coordinates || []
                    },
                    pincode: allData.address?.pincode || ''
                },
                VehicleNumber: allData.VehicleNumber || ''
            });

        } catch (error) {
            console.log("Internal server error", error);
            toast.error(error?.response?.data?.message || 'Internal server error');
        }
    };

    useEffect(() => {
        fetchProvider();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [field]: value
                }
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // const updatedData = new FormData();

        // Object.entries(formData).forEach(([key, value]) => {
        //     if (key === 'address') {
        //         Object.entries(value).forEach(([addressKey, addressValue]) => {
        //             if (addressKey === 'location') {
        //                 updatedData.append(`address[${addressKey}][type]`, addressValue.type);
        //                 updatedData.append(`address[${addressKey}][coordinates]`, JSON.stringify(addressValue.coordinates));
        //             } else {
        //                 updatedData.append(`address[${addressKey}]`, addressValue);
        //             }
        //         });
        //     } else {
        //         updatedData.append(key, value);
        //     }
        // });

        try {
            const response = await axios.put(`https://apiking.digital4now.in/api/v1/update_account/${providerId}`, formData);
            if (response.data.success) {
                toast.success('Profile updated successfully');
            }
            window.location.href="/dashboard"
        } catch (error) {
            console.log("Internal server error", error)
            toast.error(error?.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (label, name, type = 'text', placeholder, Icon) => (
        // <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className=''>
            <label className="text-gray-700 text-sm font-medium block mb-2">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type={type}
                    name={name}
                    value={name.includes('address') ? formData.address[name.split('.')[1]] : formData[name]}
                    onChange={(e) => {
                        handleChange(e);
                        if (name === 'address.street_address') {
                            fetchAddressSuggestions(e.target.value);
                        }
                    }}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={placeholder}
                />
                {name === 'address.street_address' && addressSuggestions.length > 0 && (
                    <ul className="absolute bg-white border border-gray-300 w-full mt-1 rounded-lg z-10">
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
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {suggestion?.description}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
        // </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900">Update Profile</h1>
                    <p className="mt-2 text-gray-600">Update your account information</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
                    <div className=" grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* {renderInput('Full Name', 'name', 'text', 'Enter your full name', FiUser)} */}
                        {renderInput('Email Address', 'email', 'email', 'Enter your email', FiMail)}
                        {renderInput('Phone Number', 'number', 'tel', 'Enter your phone number', FiPhone)}
                        {category === '676ef9685c75082fcbc59c4f' && (
                            renderInput('Vehicle Number', 'VehicleNumber', 'text', 'Enter vehicle number', FiTruck)
                        )}

                        {renderInput('Area', 'address.area', 'text', 'Enter area', FiMapPin)}
                        {renderInput('Street Address', 'address.street_address', 'text', 'Enter street address', FiMapPin)}
                        {renderInput('Landmark', 'address.landmark', 'text', 'Enter landmark', FiMapPin)}
                        {renderInput('Pincode', 'address.pincode', 'text', 'Enter pincode', FiMapPin)}

                    </div>
                    <div className="pt-4 w-full">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#DA2D29] text-white py-3 px-4 rounded-lg hover:bg-[#DA2D29] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateProfile;
