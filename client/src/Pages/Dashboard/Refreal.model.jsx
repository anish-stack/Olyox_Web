import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const ReferralModal = ({ isOpen = true, onClose, vendor_id, referralCode }) => {
    console.log(vendor_id)
    const [formData, setFormData] = useState({
        contactNumber: '',
        name: '',
        state: '',
        vendor_id,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(()=>{
        setFormData((prev)=>({
            ...prev,
            vendor_id:vendor_id
        }))
    },[vendor_id])

    const message = () => {
        const whatsappMessage = `
*Hey, here is my referral code:* ${referralCode}

_Join Olyox - Your One-Stop Service Platform_

**Experience seamless services across rides, hotels, meals, and transport** - all in one place with Olyox.

Whether you're looking for an easy ride, booking a hotel, ordering meals, or arranging transportation, Olyox has got you covered.

*Sign up today and unlock a world of convenience with Olyox.* Don't miss out, use my referral code when registering!

*Click here to register:* [Register Now](http://localhost:5173/Register?referral=${referralCode})
        `;

        const whatsappLink = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
        window.location.href = whatsappLink;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = sessionStorage.getItem('token');
            await axios.post(
                'https://www.webapi.olyox.com/api/v1/do-Reffer',
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess('Referral submitted successfully!');
            setTimeout(() => {
                onClose();
            }, 2000);
            message()
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Refer a Friend</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter full name"
                            required
                        />
                    </div>

                    {/* Contact Number Field */}
                    <div>
                        <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Number
                        </label>
                        <input
                            type="tel"
                            id="contactNumber"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter contact number"
                            required
                        />
                    </div>

                    {/* State Field */}
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                            State
                        </label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter state"
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm">{success}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Submitting...
                            </span>
                        ) : (
                            'Submit Referral'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReferralModal;