import { useEffect, useState } from "react";
import axios from 'axios';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        VehicleNumber: '',
        email: '',
        number: '',
        password: '',
        category: '',
        address: {
            area: '',
            street_address: '',
            landmark: '',
            pincode: '',
            location: {
                type: 'Point',
                coordinates: []
            }
        },
        referral_code_which_applied: '',
        is_referral_applied: false,
        member_id: '',
        imageone: null,
        imageTwo: null,
    });

    const [categories, setCategories] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchCategory();
        fetchMembershipPlan();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Please enter your name.';
        if (!formData.email.trim()) newErrors.email = 'Please provide your email address.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address (e.g., user@example.com).';
        if (!formData.number.trim()) newErrors.number = 'Please enter your phone number.';
        if (!/^\d{10}$/.test(formData.number)) newErrors.number = 'Phone number must be exactly 10 digits.';
        if (!formData.password.trim()) newErrors.password = 'Please create a password.';
        if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long.';
        if (!formData.category) newErrors.category = 'Please select a category.';
        if (!formData.address.pincode.trim()) newErrors.pincode = 'Please enter your area pincode.';
        if (!formData.member_id) newErrors.member_id = 'Please select a membership plan.';

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
            const { data } = await axios.get('http://localhost:7000/api/v1/categories_get');
            setCategories(data.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMembershipPlan = async () => {
        try {
            const { data } = await axios.get('http://localhost:7000/api/v1/membership-plans');
            setMemberships(data.data);
        } catch (err) {
            console.error('Error fetching membership plans:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

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
            } else if (key === 'imageone' || key === 'imagetwo') {
                if (value) {
                    updatedData.append(key, value);
                }
            } else {
                updatedData.append(key, value);
            }
        });

        try {
            const response = await axios.post('http://localhost:7000/api/v1/register_vendor', updatedData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Registration successful:', response.data);

            if (response.data?.success) {
                window.location.href = `/otp-verify?type=${response.data?.type}&email=${response?.data?.email}&expireTime=${response?.data?.time}`
            }
            // Reset form or redirect here

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            alert(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="register-container">
            <div className="register-form-wrapper">
                <h2 className="register-title">Vendor Registration</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'error' : ''}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="number">Phone Number</label>
                        <input
                            type="tel"
                            id="number"
                            name="number"
                            value={formData.number}
                            onChange={handleChange}
                            className={errors.number ? 'error' : ''}
                        />
                        {errors.number && <span className="error-message">{errors.number}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleSelect}
                            className={errors.category ? 'error' : ''}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category._id}>{category.title}</option>
                            ))}
                        </select>
                        {errors.category && <span className="error-message">{errors.category}</span>}
                    </div>

                    {formData.category === '676ef9685c75082fcbc59c4f' && (
                        <div className="form-group">
                            <label htmlFor="VehicleNumber">Vehicle Number</label>
                            <input
                                type="text"
                                id="VehicleNumber"
                                name="VehicleNumber"
                                value={formData.VehicleNumber}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="address.area">Area</label>
                        <input
                            type="text"
                            id="address.area"
                            name="address.area"
                            value={formData.address.area}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{position:'relative'}} className="form-group">
                        <label htmlFor="address.street_address">Street Address</label>
                        <input
                            type="text"
                            id="address.street_address"
                            name="address.street_address"
                            value={formData.address.street_address}
                            onChange={(e) => {
                                handleChange(e);
                                fetchAddressSuggestions(e.target.value);
                            }}
                        />
                        {addressSuggestions.length > 0 && (
                            <ul className="address-suggestions">
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
                                    >
                                        {suggestion?.description}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address.landmark">Landmark</label>
                        <input
                            type="text"
                            id="address.landmark"
                            name="address.landmark"
                            value={formData.address.landmark}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address.pincode">Pincode</label>
                        <input
                            type="text"
                            id="address.pincode"
                            name="address.pincode"
                            value={formData.address.pincode}
                            onChange={handleChange}
                            className={errors.pincode ? 'error' : ''}
                        />
                        {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                    </div>

                    <div className="form-group checkbox-group">
                        <input
                            type="checkbox"
                            id="is_referral_applied"
                            name="is_referral_applied"
                            checked={formData.is_referral_applied}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_referral_applied: e.target.checked }))}
                        />
                        <label htmlFor="is_referral_applied">Apply Referral</label>
                    </div>

                    {formData.is_referral_applied && (
                        <div className="form-group">
                            <label htmlFor="referral_code">Referral Code</label>
                            <input
                                type="text"
                                id="referral_code"
                                name="referral_code_which_applied"
                                value={formData.referral_code_which_applied}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="member_id">Membership Plan</label>
                        <select
                            id="member_id"
                            name="member_id"
                            value={formData.member_id}
                            onChange={handleSelect}
                            className={errors.member_id ? 'error' : ''}
                        >
                            <option value="">Select a membership plan</option>
                            {memberships.map((plan, index) => (
                                <option key={index} value={plan._id}>{plan.title}</option>
                            ))}
                        </select>
                        {errors.member_id && <span className="error-message">{errors.member_id}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageone">Image One</label>
                        <input
                            type="file"
                            id="imageone"
                            name="imageone"
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="file-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="imagetwo">Image Two</label>
                        <input
                            type="file"
                            id="imagetwo"
                            name="imagetwo"
                            onChange={handleFileUpload}
                            accept="image/*"
                            className="file-input"
                        />
                    </div>

                    <button type="submit" className="submit-button" disabled={submitting}>
                        {submitting ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;