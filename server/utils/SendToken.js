const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const sendToken = async (user, res, status) => {
    try {
        console.log("Generating JWT token for user:", user._id); // ✅ console log

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_TIME || '7d'
        });

        console.log("JWT token generated:", token); // ✅ console log

        const options = {
            httpOnly: true,
            secure: true, // set to false in local dev
            sameSite: 'None', // use 'Lax' or 'Strict' if on same origin
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        };

        console.log("Sending token in cookie with options:", options); // ✅ console log

        res
            .status(status)
            .cookie('token', token, options)
            .json({
                success: true,
                token,
                user, // You can sanitize user if needed
                message: 'Login successful',
            });
    } catch (error) {
        console.error("Error in sendToken:", error.message); // ✅ error log
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = sendToken;
