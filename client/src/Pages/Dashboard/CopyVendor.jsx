import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const CopyVendor = () => {
    const [formData, setFormData] = useState({
        Newemail: "",
        category: "",
        number: "",
        password:"",
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");

    const [timer, setTimer] = useState(0);
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        // Fetch categories on component mount
        const fetchCategories = async () => {
            try {
                const response = await axios.get(
                    "https://www.api.olyox.com/api/v1/categories_get",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setCategories(response.data.data || []);
            } catch (error) {
                toast.error("Failed to fetch categories.");
            }
        };

        fetchCategories();
    }, [token]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle OTP input change
    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.category) {
            toast.error("Please select a category.");
            return;
        }
        if (!/^\d{10}$/.test(formData.number)) {
            toast.error("Please provide a valid 10-digit phone number.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                "https://www.api.olyox.com/api/v1/copy-her-id",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success(response.data.message || "Vendor copied successfully!");
            setEmail(response.data.email)
            setOtpModalOpen(true);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to copy vendor. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP verification
    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP.");
            return;
        }
        const formDataSend = {
            email: formData.Newemail,
            
            type: "email",
            otp: otp,
        }
        setLoading(true);
        try {
            const response = await axios.post("https://www.api.olyox.com/api/v1/verify_email", formDataSend);
            toast.success(response.data.message || "OTP verified successfully!");
            setOtpModalOpen(false);
            window.location.href = "/dashboard";
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to verify OTP. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP resend
    const handleResendOtp = async () => {
        if (timer > 0) {
            toast.error(`Please wait ${timer} seconds to resend OTP.`);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                "https://www.api.olyox.com/api/v1/resend_Otp",
                { email: formData.Newemail, type: 'email' }
            );
            toast.success(response.data.message || "OTP sent successfully!");
            setTimer(120);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to resend OTP. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Timer countdown effect
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    return (
        <div className="p-4 min-h-screen flex items-center justify-center flex-col max-w-md mx-auto">
            <Toaster />
            <h1 className="text-2xl font-bold mb-4">
                Switch Your ID and Create Another One in a Different Category
            </h1>
            <form onSubmit={handleSubmit} className=" w-full  space-y-4">
                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Select Category
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* New Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        New Email
                    </label>
                    <input
                        type="text"
                        name="Newemail"
                        value={formData.Newemail}
                        onChange={handleChange}
                        placeholder="Enter new Email Id"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        New Phone Number
                    </label>
                    <input
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        placeholder="Enter new phone number"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                    Password
                    </label>
                    <input
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter Password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Copy Vendor"}
                </button>
            </form>

            {/* OTP Modal */}
            {otpModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full space-y-4">
                        <h2 className="text-xl font-semibold">Verify OTP</h2>
                        <input
                            type="text"
                            value={otp}
                            onChange={handleOtpChange}
                            placeholder="Enter OTP"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <button
                            onClick={handleVerifyOtp}
                            className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                        <button
                            onClick={handleResendOtp}
                            className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Resend OTP {timer > 0 ? `(${timer}s)` : ""}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CopyVendor;
