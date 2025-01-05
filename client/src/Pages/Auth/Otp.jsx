import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import './otp.css';

const Otp = () => {
    const location = new URLSearchParams(window.location.search);
    const type = location.get("type");
    const email = location.get("email");
    const numberGrom = location.get("number");


    const [formData, setFormData] = useState({
        otp: "",
        type: type,
        email: email,
    });
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer > 0) setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.otp || formData.otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(
                "https://api.olyox.com/api/v1/verify_email",
                formData
            );

            toast.success(response.data.message || "OTP verified successfully!");
            window.location.href = `/login?bh=${response.data.BHID}`

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to verify OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) {
            toast.error(`Please wait ${timer} seconds to resend OTP.`);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(
                "https://api.olyox.com/api/v1/resend_Otp",
                { email, type }
            );
            toast.success(response.data.message || "OTP sent successfully!");
            setTimer(120); // 2-minute timer
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP.");
        } finally {
            setLoading(false);
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#FFF4F4]">
            <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md">
                <h2 className="text-center text-2xl font-semibold mb-4">Enter OTP</h2>
                <p className="text-center text-gray-600 mb-4">
                    We have sent a 6-digit OTP to <strong>{numberGrom}</strong>
                </p>
                <form>
                    <div className="mb-4">
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                            OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            maxLength="6"
                            placeholder="Enter OTP"
                            onKeyDown={handleKeyPress}
                            value={formData.otp}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="button"
                        className="w-full bg-[#D62C27] hover:bg-[#D62C27] text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        className="text-[#D62C27] hover:text-[#D62C27] text-sm font-medium"
                        onClick={handleResendOtp}
                        disabled={timer > 0 || loading}
                    >
                        {timer > 0
                            ? `Resend OTP in ${timer}s`
                            : "Didn't receive the OTP? Resend"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Otp;
