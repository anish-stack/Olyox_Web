const Vendor_Model = require('../model/vendor.js');
const UploadService = require('../service/cloudinary.service.js');
const OtpService = require('../service/Otp_Send.Service.js');
const SendEmailService = require('../service/SendEmail.Service.js');
const crypto = require('crypto');
const sendToken = require('../utils/SendToken.js');
const bcrypt = require('bcrypt');
// Register a vendor and send a verification email
exports.registerVendor = async (req, res) => {
    try {
        console.log(req.body);
        const {
            name, VehicleNumber, email, number, password, category,
            address, referral_code_which_applied, is_referral_applied = false, member_id
        } = req.body;

        const files = req.files;
        console.log(files);

        if (!name || !email || !number || !password || !category) {
            return res.status(400).json({ success: false, message: 'Please enter all fields' });
        }

        // Validate phone number
        if (!/^\d{10}$/.test(number)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid 10-digit phone number',
            });
        }

        // Parse and validate coordinates
        let coordinatesArray;
        try {
            const coordinatesString = address.location.coordinates;
            coordinatesArray = typeof coordinatesString === 'string'
                ? JSON.parse(coordinatesString).map(coord => parseFloat(coord))
                : coordinatesString;

            if (!Array.isArray(coordinatesArray) || coordinatesArray.length !== 2) {
                throw new Error('Invalid coordinates format.');
            }
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coordinates format. Expected [longitude, latitude].',
            });
        }

        address.location.coordinates = coordinatesArray;

        // Check if the vendor already exists
        const existingVendor = await Vendor_Model.findOne({ $or: [{ email }, { number }] });
        if (existingVendor) {
            return res.status(400).json({ success: false, message: 'Vendor already exists' });
        }

        // Validate file uploads
        const imageFileOne = req.files.find(file => file.fieldname === 'imageone');
        const imageFileTwo = req.files.find(file => file.fieldname === 'imagetwo');

        if (!imageFileOne || !imageFileTwo) {
            return res.status(400).json({ success: false, message: 'Please upload both images' });
        }

        // Generate OTP
        const otpService = new OtpService();
        const { otp, expiryTime } = otpService.generateOtp();

        // Upload images to Cloudinary
        const uploadImageOne = await UploadService.uploadFromBuffer(imageFileOne.buffer);
        const uploadImageTwo = await UploadService.uploadFromBuffer(imageFileTwo.buffer);

        const genreateOrder = crypto.randomBytes(16).toString('hex');

        // Save vendor to the database
        const vendor = new Vendor_Model({
            name,
            email,
            number,
            password,
            VehicleNumber,
            category,
            address,
            Documents: {
                documentFirst: {
                    image: uploadImageOne.secure_url,
                    public_id: uploadImageOne.public_id,
                },
                documentSecond: {
                    image: uploadImageTwo.secure_url,
                    public_id: uploadImageTwo.public_id,
                },
            },
            referral_code_which_applied,
            is_referral_applied,
            otp_: otp,
            order_id: genreateOrder,
            otp_expire_time: expiryTime,
            member_id
        });

        await vendor.save();

        res.status(201).json({
            success: true,
            message: 'Vendor registered successfully',
            data: vendor,
            type: 'email',
            email: vendor.email,
            time: vendor?.otp_expire_time
        });
    } catch (error) {
        console.error('Error registering vendor:', error);
        res.status(500).json({
            success: false,
            message: 'Vendor registration failed',
            error: error.message,
        });
    }
};


exports.verifyVendorEmail = async (req, res) => {
    try {
        const { email, otp, type } = req.body;
        const vendor = await Vendor_Model.findOne({ email });

        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        if (type === 'email') {
            if (vendor.isEmailVerified) {
                return res.status(400).json({ success: false, message: 'Email already verified' });
            }

            if (vendor.otp_ !== otp) {
                return res.status(401).json({ success: false, message: 'Invalid OTP' });
            }

            if (vendor.otp_expire_time && new Date() > vendor.otp_expire_time) {
                return res.status(401).json({ success: false, message: 'OTP has expired' });
            }

            // Update vendor's email verified status
            vendor.isEmailVerified = true;
            vendor.otp_ = null;
            vendor.otp_expire_time = null;

            await vendor.save();
            return res.status(200).json({ success: true, message: 'Email verified successfully' });
        } else {
            if (vendor.password_otp !== otp) {
                return res.status(401).json({ success: false, message: 'Invalid OTP' });
            }

            if (vendor.password_otp_expire && new Date() > vendor.password_otp_expire) {
                return res.status(401).json({ success: false, message: 'OTP has expired' });
            }

            // Clear password OTP data
            vendor.password_otp = null;
            vendor.password_otp_expire = null;

            await vendor.save();
            return res.status(200).json({ success: true, message: 'Password OTP verified successfully' });
        }

    } catch (error) {
        console.error('Error verifying vendor email:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        const { type, email } = req.body;
        const vendor = await Vendor_Model.findOne({ email });

        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        const otpService = new OtpService();
        const { otp, expiryTime } = otpService.generateOtp();

        const emailService = new SendEmailService();
        const emailData = {
            to: email,
            text: `Your OTP is ${otp}`,
        };

        if (type === 'email') {
            if (vendor.isEmailVerified) {
                return res.status(400).json({ success: false, message: 'Email already verified' });
            }

            vendor.otp_ = otp;
            vendor.otp_expire_time = expiryTime;
            await vendor.save();

            emailData.subject = 'Verify your email';
            await emailService.sendEmail(emailData);
            return res.status(200).json({ success: true, message: 'OTP sent successfully for email verification' });
        } else {
            vendor.password_otp = otp;
            vendor.password_otp_expire = expiryTime;
            await vendor.save();

            emailData.subject = 'Change your Password';
            await emailService.sendEmail(emailData);
            return res.status(200).json({ success: true, message: 'Password change OTP sent successfully' });
        }

    } catch (error) {
        console.error('Error resending OTP:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.loginVendor = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide both email and password' });
        }

        const vendor = await Vendor_Model.findOne({ email }).populate('category', 'Profile_id');
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        const isPasswordMatch = await vendor.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        await sendToken(vendor, res, 200)
    } catch (error) {
        console.error('Error logging in vendor:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Vendor logout (simple session-based logout example)
exports.logoutVendor = async (req, res) => {
    try {

        res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out vendor:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


exports.getSingleProvider = async (req, res) => {
    try {
        // console.log("i am hit")
        const { id } = req.params;
        const provider = await Vendor_Model.findById(id).select('-password').populate('category').populate('member_id').populate('order_id');
        if (!provider) {
            return res.status(400).json({
                success: false,
                message: 'Provider not founded by id',
                error: 'Provider not founded by id'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Provider founded by id',
            data: provider
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            message: error.message
        })
    }
}


exports.changeVendorCategory = async (req, res) => {
    try {
        const { email, newCategory } = req.body;

        if (!email || !newCategory) {
            return res.status(400).json({ success: false, message: 'Please provide email and new category' });
        }

        const vendor = await Vendor_Model.findOne({ email });
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        vendor.category = newCategory;
        await vendor.save();

        res.status(200).json({ success: true, message: 'Vendor category updated successfully' });
    } catch (error) {
        console.error('Error updating vendor category:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Change vendor's password
exports.changeVendorPassword = async (req, res) => {
    try {
        console.log('i am hit')
        const { email, oldPassword, newPassword } = req.body;
        console.log('body',req.body)

        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide email, old password, and new password' });
        }

        const vendor = await Vendor_Model.findOne({ email });
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        const isOldPasswordMatch = await vendor.comparePassword(oldPassword);
        if (!isOldPasswordMatch) {
            return res.status(401).json({ success: false, message: 'Old password is incorrect' });
        }

        // Hash the new password before saving it

        vendor.password = newPassword;
        await vendor.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete vendor account
exports.deleteVendorAccount = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide email' });
        }

        const vendor = await Vendor_Model.findOne({ email });
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        await Vendor_Model.deleteOne({ email });
        res.status(200).json({ success: true, message: 'Vendor account deleted successfully' });
    } catch (error) {
        console.error('Error deleting vendor account:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}



exports.updateVendorDetails = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("i am hit ",id,req.body)
        const { name, email, number, password, category, address, referral_code_which_applied, is_referral_applied, member_id, VehicleNumber } = req.body;
        // console.log('object', req.body)
        // Find the vendor by email or number
        // const vendor = await Vendor_Model.findOne({ $or: [{ email }, { number }] });
        const vendor = await Vendor_Model.findById(id)

        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        // Update only the fields that are provided in the request
        if (name) vendor.name = name;
        if (email) vendor.email = email;
        if (number) vendor.number = number;
        if (VehicleNumber) vendor.VehicleNumber = VehicleNumber;
        if (password) vendor.password = password; // you may want to hash the password here before saving
        if (category) vendor.category = category;
        if (address) vendor.address = address;
        if (referral_code_which_applied !== undefined) vendor.referral_code_which_applied = referral_code_which_applied;
        if (is_referral_applied !== undefined) vendor.is_referral_applied = is_referral_applied;
        if (member_id) vendor.member_id = member_id;

        // Save the updated vendor details
        await vendor.save();
        // console.log("vendor",vendor)
        res.status(200).json({
            success: true,
            message: 'Vendor details updated successfully',
            vendor,
        });
    } catch (error) {
        console.error('Error updating vendor details:', error);
        res.status(500).json({
            success: false,
            message: 'Vendor details update failed',
            error: error.message,
        });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        // Check if vendor exists
        const vendor = await Vendor_Model.findById(id);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found',
            });
        }

        // Validate old password
        const isValidPassword = await vendor.comparePassword(oldPassword);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid old password',
            });
        }

        // Hash and update the new password
        // const hashedPassword = await bcrypt.hash(newPassword, 10);
        vendor.password = newPassword;

        // Save updated vendor data
        await vendor.save();

        // Respond with success
        return res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        });

    } catch (error) {
        console.error('Internal server error', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};
