import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Check, CreditCard, Timer, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Recharge_Model = ({ isOpen, onClose, user_id, alreadySelectedMember_id }) => {
    const [memberships, setMemberships] = useState([]);
    const [selectedMember_id, setSelectedMember_id] = useState(alreadySelectedMember_id);
    const [showQR, setShowQR] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [timer, setTimer] = useState(30 * 60); // 30 minutes in seconds
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState({})
    const [userCategory, setUserCategory] = useState('');


    useEffect(() => {
        if (isOpen) {
            const tokenExtract = sessionStorage.getItem('token')
            console.log(tokenExtract)
            if (tokenExtract) {
                setToken(tokenExtract)
                fetchMembershipPlan();
            }
        }
    }, [isOpen]);

    useEffect(() => {
        if (user_id) {
          fetchUserDetails();
        }
      }, [user_id]);
    
    useEffect(() => {
        let interval;
        if (showQR && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [showQR, timer]);

    const fetchUserDetails = async () => {
        try {
            const { data } = await axios.get(`https://www.webapi.olyox.com/api/v1/get_Single_Provider/${user_id}`);
            setUserCategory(data.data.category?.title);
            // fetchMembershipPlan();
        } catch (err) {
            console.error('Error fetching user details:', err);
        }
    };

    const fetchMembershipPlan = async () => {
        try {
            const { data } = await axios.get('https://www.webapi.olyox.com/api/v1/membership-plans');
            // console.log("data", data.data)
            const filterData = data.data.filter(plan => plan.category === userCategory);
            // console.log("filterData", filterData)
            setMemberships(filterData);
        } catch (err) {
            console.error('Error fetching membership plans:', err);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handlePlanSelect = (memberId) => {
        setSelectedMember_id(memberId);
        setShowQR(true);
    };

    const handleCancelPayment = () => {
        setShowQR(false);
        setTransactionId('');
        setTimer(30 * 60);
    };


    const handleRecharge = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post('https://www.webapi.olyox.com/api/v1/do-recharge', {
                plan_id: selectedMember_id,
                trn_no: transactionId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(data)

            toast.success(data?.message)
            setTimeout(() => {
                setLoading(false)
                window.location.reload()
            }, 2300);

        } catch (error) {
            setLoading(false)

            console.log(error)
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {showQR ? 'Complete Payment' : 'Recharge Plans'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {!showQR ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {memberships.map((plan) => (
                                <div
                                    key={plan._id}
                                    className={`relative border rounded-xl p-6 ${plan._id === selectedMember_id
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-200 hover:border-red-300'
                                        } transition-all`}
                                >
                                    {plan._id === alreadySelectedMember_id && (
                                        <div className="absolute -top-3 -right-3">
                                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                Current Plan
                                            </span>
                                        </div>
                                    )}
                                    <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                                    <div className="text-2xl font-bold text-red-600 mb-4">
                                        ₹{plan.price} <span className="text-base text-gray-800">+ 18% Gst Extra</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">{plan.description}</p>
                                    {/* <div className="space-y-2 mb-6">
                                        {plan.includes.map((feature, index) => (
                                            <div key={index} className="flex items-center text-gray-600">
                                                <Check className="w-4 h-4 text-green-500 mr-2" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div> */}
                                    <div className="text-sm text-gray-500 mb-4">
                                        Valid for {plan.validityDays} {plan.whatIsThis}
                                    </div>
                                    <button
                                        onClick={() => handlePlanSelect(plan._id)}
                                        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <div>
                                            <h2>Select Plan and Pay {plan.price ? `₹${(plan.price * 1.18).toFixed(2)}` : 'Price not available'}</h2>
                                        </div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="max-w-md mx-auto space-y-6">
                            <div className="text-center">
                                <Timer className="w-6 h-6 text-red-600 mx-auto mb-2" />
                                <p className="text-lg font-semibold">Time Remaining: {formatTime(timer)}</p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <div className="w-48 h-48 mx-auto mb-4 overflow-hidden rounded-lg">
                                    <img
                                        src="https://offercdn.paytm.com/blog/2022/02/scan/scan-banner.png"
                                        alt="QR Code"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Transaction ID
                                        </label>
                                        <input
                                            type="text"
                                            value={transactionId}
                                            onChange={(e) => setTransactionId(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                            placeholder="Enter transaction ID"
                                        />
                                    </div>

                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                        <div className="flex">
                                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                                            <div className="ml-3">
                                                <p className="text-sm text-yellow-700">
                                                    Please complete the payment and enter the transaction ID within 30 minutes.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleRecharge()}
                                            disabled={!transactionId || loading}
                                            className="flex-1 text-base whitespace-nowrap  bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <CreditCard className="w-5 hidden md:block h-5" />
                                            {loading ? 'Verifying...' : 'Verify Payment'}
                                        </button>

                                        <button
                                            onClick={handleCancelPayment}
                                            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <X className="w-5 h-5" />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recharge_Model;
