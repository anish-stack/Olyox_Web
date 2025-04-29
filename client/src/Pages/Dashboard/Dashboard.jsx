import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FiUser, FiDollarSign, FiUsers, FiRefreshCw, FiEdit, FiLock, FiHelpCircle, FiGrid, FiTrendingUp, FiActivity, FiPieChart } from 'react-icons/fi';
import LoginAlert from '../../Components/AlertPages/LoginAlert';
import { Clock, Coins, CoinsIcon, CopyCheck, IndianRupee, LogOut, Outdent, Share, Share2Icon, UserPlus } from 'lucide-react';
import Recharge_Model from './Recharge_Model';
import { formatDate } from './formData';
import ReferralModal from './Refreal.model';

function Dashboard() {
    const [allProvider, setAllProvider] = useState({});
    const [allRefreal, setAllRefreal] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false)
    const [isRefreal, setIsRefreal] = useState(false)

    const SessionData = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    useEffect(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        },[])

    if (!token) {
        return <LoginAlert />;
    }


    const handleOpen = () => {
        setIsOpen(true)
    }
    const handleClose = () => {
        setIsOpen(false)
    }
    const handleOpenR = () => {
        setIsRefreal(true)
    }
    const handleCloseR = () => {
        setIsRefreal(false)
    }

    const handleLogOut = () => {
        sessionStorage.clear()
        window.location.href = '/'
    }

    const Provider = JSON.parse(SessionData);
    const providerId = Provider?._id;

    const fetchProvider = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get(`https://www.webapi.olyox.com/api/v1/get_Single_Provider/${providerId}`);
            const levelLengths = Array.from({ length: 7 }, (_, i) => data.data?.[`Level${i + 1}`]?.length);
            const totalLength = levelLengths.reduce((sum, length) => sum + length, 0);
            setAllRefreal(totalLength)
            setAllProvider(data.data);
        } catch (error) {
            console.log("Internal server error", error);
            toast.error(error?.response?.data?.message || 'Internal server error');
        } finally {
            setIsLoading(false);
        }
    };

    // const fetchReferralsDetaisl = async () => {
    //     try {
    //         const { data } = await axios.get(`https://www.webapi.olyox.com/api/v1/get-refer-data?id=${allProvider?.myReferral}`)
    //         console.log(data.data)
    //         setAllRefreal(data.data)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }



    useEffect(() => {
        // fetchReferralsDetaisl()
        fetchProvider();
    }, []);

    const menuItems = [
        { icon: <FiRefreshCw className="w-6 h-6" />, fnd: handleOpen, title: 'Quick Recharge', description: 'Top up your account', color: 'from-blue-400 to-blue-600' },
        { icon: <FiEdit className="w-6 h-6" />, title: 'Update Profile', description: 'Modify your details', link: '/update-profile', color: 'from-purple-400 to-purple-600' },
        { icon: <FiLock className="w-6 h-6" />, title: 'Security', description: 'Change password', link: '/change-password', color: 'from-red-400 to-red-600' },
        { icon: <FiHelpCircle className="w-6 h-6" />, title: 'Support', description: 'Get help', link: '/contact', color: 'from-green-400 to-green-600' },

        { icon: <Coins className="w-6 h-6" />, title: 'Recharge History', description: 'Check Your Past Recharge', link: '/Recharge-History', color: 'from-indigo-400 to-yellow-600' },
        { icon: <Outdent className="w-6 h-6" />, title: 'Withdraw History', description: ' Past and present Withdrawals', link: '/Withdrawals-History', color: 'from-gray-400 to-red-600' },
        { icon: <UserPlus className="w-6 h-6" />, title: 'Referral History', description: ' Past and present Referral', link: '/Refrreral-History', color: 'from-gray-400 to-red-600' },
        { icon: <CopyCheck className="w-6 h-6" />, title: 'Other Vendor Ids', description: ' Other Vendor Ids', link: `/Other-Vendor-Ids?id=${providerId}`, color: 'from-gray-400 to-red-600' }


    ];

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-[#A91E1B] px-6 py-8">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAgdmlld0JveD0iMCAwIDE0NDAgNTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBvcGFjaXR5PSIwLjA1IiBkPSJNLTI4LjY2NjcgNDkuMzMzM0wxNDQwIDQ5LjMzMzNWNDcwLjY2N0wtMjguNjY2NyA0NzAuNjY3VjQ5LjMzMzNaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXIpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXIiIHgxPSI3MDUuNjY3IiB5MT0iNDkuMzMzMyIgeDI9IjcwNS42NjciIHkyPSI0NzAuNjY3IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IndoaXRlIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPg==')] opacity-10"></div>
                <div className="relative">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl font-bold flex gap-3 text-white mb-2">
                                {allProvider?.name || 'Welcome Back!'}
                                <p className="text-sm font-bold text-white mb-2">
                                    <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                                        {allProvider?.member_id?.title || 'Plan Expired'}
                                    </span>
                                </p>
                            </h1>
                            <p className="text-sm font-bold text-white mb-2">{allProvider?.category?.title}</p>
                            {/* {
                                        allProvider.plan_status ? (
                                            <span className="text-white text-sm font-bold">Plan Active</span>
                                        ):null
                                    } */}
                            <div className="mb-3 mt-3">
                                {allProvider?.payment_id?.payment_approved ? (
                                    new Date(allProvider?.payment_id?.end_date) < new Date() ? (
                                        <span className="inline-block bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                            Plan Expired
                                        </span>
                                    ) : (
                                        <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                            Plan Expire At: {formatDate(allProvider?.payment_id?.end_date)}
                                        </span>
                                    )
                                ) : null}
                            </div>
                            {/* 
                            <div className="flex items-center cursor-pointer justify-between sm:justify-start space-x-4 bg-gradient-to-r from-red-700 to-red-600 rounded-lg px-6 py-3 shadow-lg">
                                <div onClick={handleOpenR} className="flex items-center space-x-2">
                                    <FiUser className="text-white text-lg" />

                                    <span className="text-white font-semibold text-sm">
                                        Referral Code: {allProvider?.myReferral || 'N/A'}
                                    </span>
                                </div>

                                <div onClick={() => message(allProvider?.myReferral)} className="flex items-center space-x-2">
                                    <span className="text-white text-xs font-medium">Share</span>
                                    <Share2Icon className="text-white text-lg" />
                                </div>
                            </div> */}
                            <button
                                disabled={allProvider?.plan_status === false} // Disables the button if plan_status is false
                                onClick={() => {
                                    if (allProvider?.plan_status === false) {
                                        alert('Your plan has expired. Please renew to use the referral code.');
                                    } else {
                                        handleOpenR(); // Proceed with the normal functionality
                                    }
                                }}
                                className="flex items-center space-x-2 bg-gradient-to-r from-red-700 to-red-600 rounded-lg px-6 py-3 shadow-lg"
                            >
                                <FiUser className="text-white text-lg" />
                                <span className="text-white font-semibold text-sm">
                                    Referral Code: {allProvider?.myReferral || 'N/A'}
                                </span>
                            </button>


                            <div className="flex mt-2 items-center bg-red-5600 p-3 rounded-md shadow-sm">
                                <Clock className="text-white text-xl mr-3" />
                                <div>
                                    <span className="text-white font-medium">Plan Status:</span>
                                    <span className={`ml-2 font-semibold ${allProvider?.plan_status ? 'text-green-300' : 'text-yellow-300'}`}>
                                        {allProvider?.plan_status ? 'Active' : 'De-Active'}
                                    </span>
                                </div>
                            </div>

                        </div>

                        <div>

                            <div onClick={handleLogOut} className="flex items-center cursor-pointer space-x-2 bg-white/10 rounded-lg px-4 py-2">
                                <LogOut className="text-white" />
                                <span className="text-white font-medium">Log Out</span>
                            </div>
                            <a href="/Dublicate-vendor" className="flex mt-5 items-center cursor-pointer space-x-2 bg-white/10 rounded-lg px-4 py-2">
                                <UserPlus className="text-white" />
                                <span className="text-white font-medium">Make New id</span>
                            </a>
                        </div>

                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="container mx-auto px-6 -mt-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center cursor-pointer justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Referral Earnings</p>
                                <h3 className="text-2xl font-bold text-gray-900">₹{allProvider?.wallet || '0'}</h3>
                                <p className="text-xs text-green-500 mt-2 flex items-center">
                                    <FiTrendingUp className="mr-1" />
                                    +12.5% from last month
                                </p>
                            </div>
                            <div className="bg-blue-500/10 p-3 rounded-full">
                                <IndianRupee className="w-8 h-8 text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <a href={`/get-my-referral/${providerId}`} className="flex items-center cursor-pointer justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Referrals</p>
                                <h3 className="text-2xl font-bold text-gray-900">{allRefreal || '0'}</h3>
                                <p className="text-xs text-green-500 mt-2 flex items-center">
                                    <FiActivity className="mr-1" />
                                    +8.2% growth rate
                                </p>
                            </div>
                            <div className="bg-purple-500/10 p-3 rounded-full">
                                <FiUsers className="w-8 h-8 text-purple-500" />
                            </div>
                        </a>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center cursor-pointer justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Category Earnings</p>
                                <h3 className="text-2xl font-bold text-gray-900">₹{allProvider?.categoryEarnings || '0'}</h3>
                                <p className="text-xs text-green-500 mt-2 flex items-center">
                                    <FiPieChart className="mr-1" />
                                    +15.3% category growth
                                </p>
                            </div>
                            <div className="bg-green-500/10 p-3 rounded-full">
                                <IndianRupee className="w-8 h-8 text-green-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 pb-8">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            onClick={item?.fnd}
                            className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                            <div className="p-6">
                                <div className="mb-4">
                                    <div className="bg-gray-100 group-hover:bg-white/10 rounded-full w-12 h-12 flex items-center justify-center transition-colors duration-300">
                                        {item.icon}
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-900 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <ReferralModal isOpen={isRefreal} onClose={handleCloseR} referralCode={allProvider?.myReferral} vendor_id={allProvider?._id} />
            <Recharge_Model isOpen={isOpen} onClose={handleClose} user_id={allProvider?._id} alreadySelectedMember_id={allProvider?.member_id?._id} />
        </div>
    );
}

export default Dashboard;