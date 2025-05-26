import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Check, CreditCard, AlertCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const Recharge_Model = ({ isOpen, onClose, user_id, alreadySelectedMember_id }) => {
    const [memberships, setMemberships] = useState([]);
    const [selectedMember_id, setSelectedMember_id] = useState(alreadySelectedMember_id);
    const [loading, setLoading] = useState(false);
    const [paymentInProgress, setPaymentInProgress] = useState(false);
    const [token, setToken] = useState('');
    const [userCategory, setUserCategory] = useState('');
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (isOpen) {
            const tokenExtract = sessionStorage.getItem('token');
            if (tokenExtract) {
                setToken(tokenExtract);
                fetchMembershipPlan();
            }
        }
    }, [isOpen]);

    useEffect(() => {
        if (user_id) {
            fetchUserDetails();
        }
    }, [user_id]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`https://webapi.olyox.com/api/v1/get_Single_Provider/${user_id}`);
            setUserData(data.data);
            setUserCategory(data.data.category?.title || '');
            setLoading(false);
        } catch (err) {
            setLoading(false);
            toast.error('Failed to fetch user details');
            console.error('Error fetching user details:', err);
        }
    };

    const fetchMembershipPlan = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('https://webapi.olyox.com/api/v1/membership-plans');

            // Filter plans based on user category if available
            if (userCategory) {
                const normalizedUserCategory = userCategory.toLowerCase().replace(/\s+/g, '');

                const filterData = data.data.filter(plan => {
                    if (!plan.category) return false;

                    const normalizedPlanCategory = plan.category.toLowerCase().replace(/\s+/g, '');
                    return (
                        normalizedPlanCategory.includes(normalizedUserCategory) ||
                        normalizedUserCategory.includes(normalizedPlanCategory)
                    );
                });

                setMemberships(filterData);
            } else {
                setMemberships(data.data);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            toast.error('Failed to fetch membership plans');
            console.error('Error fetching membership plans:', err);
        }
    };

    const initializeRazorpay = async (planId) => {
        try {
            setPaymentInProgress(true);


            // Create order on your backend
            const orderResponse = await axios.get(`https://appapi.olyox.com/api/v1/rider/recharge-wallet/${selectedMember_id}/${userData?.myReferral}`);

            if (!orderResponse.data || !orderResponse.data.order) {
                throw new Error("Invalid response from server");
            }

            const selectedPlan = memberships.find(plan => plan._id === planId);

            // Load Razorpay script if not already loaded
            if (!window.Razorpay) {
                await loadRazorpayScript();
            }

            // Configure Razorpay options
            const options = {
                key: "rzp_live_zD1yAIqb2utRwp", // Replace with your Razorpay key
                amount: orderResponse.data.order.amount,
                currency: orderResponse.data.order.currency,
                name: "OLYOX Pvt. Ltd.",
                description: `${selectedPlan.title} Membership`,
                image: "https://olyox.com/assets/logo-CWkwXYQ_.png",
                order_id: orderResponse.data.order.id,
                handler: function (response) {
                    handlePaymentSuccess(response, planId);
                },
                prefill: {
                    name: userData?.name || '',
                    email: userData?.email || '',
                    contact: userData?.phone || ''
                },
                notes: {
                    plan_id: planId,
                    user_id: user_id
                },
                theme: {
                    color: "#d82c2a"
                },
                modal: {
                    ondismiss: function () {
                        handlePaymentCancelled();
                    }
                }
            };

            // Open Razorpay checkout
            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            setPaymentInProgress(false);
            toast.error(error.response?.data?.message || "Failed to initialize payment");
            console.error("Payment initialization error:", error);
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
                toast.error("Razorpay SDK failed to load. Check your internet connection.");
            };
            document.body.appendChild(script);
        });
    };

    const handlePaymentSuccess = async (response, planId) => {
        try {
            // Verify payment on your backend
            const verifyResponse = await axios.post(`https://appapi.olyox.com/api/v1/rider/recharge-verify/${userData?.myReferral}`, {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                plan_id: planId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (verifyResponse.data.success) {
                toast.success("Payment successful! Your plan has been activated.");
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                toast.error("Payment verification failed. Please contact support.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed");
            console.error("Payment verification error:", error);
        } finally {
            setPaymentInProgress(false);
        }
    };

    const handlePaymentCancelled = () => {
        setPaymentInProgress(false);
        toast.error("Payment was cancelled. Please try again when you're ready.");
    };

    const handlePlanSelect = (planId) => {
        setSelectedMember_id(planId);
        initializeRazorpay(planId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Membership Plans
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={paymentInProgress}
                        className="text-gray-400 hover:text-gray-500 transition-colors disabled:opacity-50"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader className="w-8 h-8 text-red-600 animate-spin" />
                            <span className="ml-3 text-lg">Loading plans...</span>
                        </div>
                    ) : memberships.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No plans available</h3>
                            <p className="text-gray-600">
                                We couldn't find any membership plans for your category.
                                Please contact support for assistance.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {memberships.map((plan) => {
                                // Calculate price with GST
                                const priceWithGST = plan.price ? Number((plan.price * 1.18).toFixed(2)) : null;

                                return (
                                    <div
                                        key={plan._id}
                                        className={`relative border rounded-xl p-6 transition-all hover:shadow-md ${plan._id === selectedMember_id
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-200 hover:border-red-300'
                                            }`}
                                    >
                                        {plan._id === alreadySelectedMember_id && (
                                            <div className="absolute -top-3 -right-3">
                                                <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                                                    Current Plan
                                                </span>
                                            </div>
                                        )}
                                        <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                                        <div className="text-2xl font-bold text-red-600 mb-4">
                                            ₹{plan.price} <span className="text-sm text-gray-500">+ 18% GST</span>
                                        </div>
                                        <p className="text-gray-600 mb-4">{plan.description}</p>

                                        {plan.features && plan.features.length > 0 && (
                                            <div className="space-y-2 mb-6">
                                                {plan.features.map((feature, index) => (
                                                    <div key={index} className="flex items-start">
                                                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-600 text-sm">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="text-sm text-gray-500 mb-6">
                                            Valid for {plan.validityDays} {plan.whatIsThis || 'days'}
                                        </div>

                                        <button
                                            onClick={() => handlePlanSelect(plan._id)}
                                            disabled={paymentInProgress}
                                            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {paymentInProgress ? (
                                                <>
                                                    <Loader className="w-4 h-4 animate-spin" />
                                                    <span>Processing...</span>
                                                </>
                                            ) : plan._id === alreadySelectedMember_id ? (
                                                'Current Plan'
                                            ) : (
                                                <>
                                                    <CreditCard className="w-5 h-5" />
                                                    <span>Pay ₹{priceWithGST || 'N/A'}</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {paymentInProgress && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center max-w-md w-full">
                                <Loader className="w-12 h-12 text-red-600 animate-spin mb-4" />
                                <h3 className="text-xl font-medium mb-2">Processing Payment</h3>
                                <p className="text-gray-600 text-center">
                                    Please complete the payment in the Razorpay window.
                                    Do not close this window.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                        <p className="text-sm text-gray-600">
                            All payments are secured by Razorpay. After successful payment, your plan will be activated immediately.
                            For any payment issues, please contact our support team.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recharge_Model;
