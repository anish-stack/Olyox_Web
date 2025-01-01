const Vendor_Model = require('../model/vendor.js');
const ActiveReferral_Model = require('../model/activereferal.js');
const UploadService = require('../service/cloudinary.service.js');
const OtpService = require('../service/Otp_Send.Service.js');
const SendEmailService = require('../service/SendEmail.Service.js');
const crypto = require('crypto');
const sendToken = require('../utils/SendToken.js');
const bcrypt = require('bcrypt');
const BhIdSchema = require('../model/Partner.model.js');
const { CronJob } = require('cron');
// Register a vendor and send a verification email

exports.registerVendor = async (req, res) => {
    try {
        const {
            dob,
            name, VehicleNumber, email, number, password, category,
            aadharNumber,
            panNumber,
            address, referral_code_which_applied, is_referral_applied = false
        } = req.body;

        const files = req.files || [];
        if (!name || !email || !number || !password || !category) {
            return res.status(400).json({ success: false, message: 'Please enter all fields' });
        }

        if (dob) {
            const dobDate = new Date(dob);
            const currentDate = new Date();
            const age = currentDate.getFullYear() - dobDate.getFullYear();
            const isBeforeBirthday = currentDate < new Date(dobDate.setFullYear(currentDate.getFullYear()));

            if (age < 18 || (age === 18 && isBeforeBirthday)) {
                return res.status(400).json({ success: false, message: 'Vendor must be at least 18 years old' });
            }
        }

        // Validate phone number
        if (!/^\d{10}$/.test(number)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid 10-digit phone number',
            });
        }



        // Validate address and coordinates
        if (!address || !address.location || !address.location.coordinates) {
            return res.status(400).json({
                success: false,
                message: 'Address or location coordinates are missing',
            });
        }

        // Check if the coordinates field is a string
        let coordinatesArray = [];

        if (
            address?.location?.coordinates &&
            typeof address.location.coordinates === 'string'
        ) {
            // Parse the string into an array
            try {
                coordinatesArray = JSON.parse(address.location.coordinates).map(coord => parseFloat(coord));
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid coordinates format. Unable to parse string to array.',
                });
            }
        } else if (
            address?.location?.coordinates &&
            Array.isArray(address.location.coordinates) &&
            address.location.coordinates.length === 2
        ) {
            // If coordinates are already in an array format, use them as is
            coordinatesArray = address.location.coordinates.map(coord => parseFloat(coord));
        }

        // Final validation to ensure the coordinates are a valid array of two numbers
        if (
            !Array.isArray(coordinatesArray) ||
            coordinatesArray.length !== 2 ||
            coordinatesArray.some(isNaN)
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid coordinates format. Expected [longitude, latitude].',
            });
        }

        console.log('Normalized Coordinates:', coordinatesArray);

        address.location.coordinates = coordinatesArray;

        // Check if the vendor already exists
        const existingVendor = await Vendor_Model.findOne({ $or: [{ email }, { number }] });
        if (existingVendor) {
            return res.status(400).json({ success: false, message: 'Vendor already exists' });
        }

        // Validate file uploads
        const imageFileOne = files.find(file => file.fieldname === 'aadharfront');
        const imageFileTwo = files.find(file => file.fieldname === 'aadharback');
        const imageFileThree = files.find(file => file.fieldname === 'pancard');

        if (!imageFileOne || !imageFileTwo) {
            return res.status(400).json({ success: false, message: 'Please upload both images' });
        }

        // Upload images to Cloudinary
        const uploadImageOne = await UploadService.uploadFromBuffer(imageFileOne.buffer);
        const uploadImageTwo = await UploadService.uploadFromBuffer(imageFileTwo.buffer);
        const uploadImageThree = await UploadService.uploadFromBuffer(imageFileThree.buffer);



        // Generate codes
        const otpService = new OtpService();
        const { otp, expiryTime } = otpService.generateOtp();
        const genreateOrder = crypto.randomBytes(16).toString('hex');
        function generateBhId() {
            const randomNum = crypto.randomInt(100000, 999999);
            return `BH${randomNum}`;
        }

        const emailService = new SendEmailService();

        const genreateReferral = generateBhId()
        const insertBh = new BhIdSchema({
            BhId: genreateReferral,
        })

        let checkReferral = null;
        let checkReferralFromBh = null;

        if (referral_code_which_applied) {
            checkReferral = await Vendor_Model.findOne({ myReferral: referral_code_which_applied });
        } else {
            checkReferralFromBh = await BhIdSchema.findOne({ BhId: referral_code_which_applied });
        }

        const vendor = new Vendor_Model({
            name,
            email,
            number,
            password,
            VehicleNumber,
            parentReferral_id: checkReferral?._id,
            category,
            address,
            aadharNumber,
            panNumber,
            myReferral: genreateReferral,
            Documents: {
                documentFirst: {

                    image: uploadImageOne.secure_url,
                    public_id: uploadImageOne.public_id,
                },
                documentSecond: {
                    image: uploadImageTwo.secure_url,
                    public_id: uploadImageTwo.public_id,
                },
                documentThird: {
                    image: uploadImageThree.secure_url,
                    public_id: uploadImageThree.public_id,
                },
            },
            referral_code_which_applied,
            is_referral_applied,
            otp_: otp,
            dob,
            order_id: genreateOrder,
            otp_expire_time: expiryTime,

        });


        async function addChildToAllParents(vendorId, parentReferralId) {
            if (!parentReferralId) return;

            const parentReferral = await Vendor_Model.findById(parentReferralId);
            if (parentReferral) {
                if (!parentReferral.Child_referral_ids.includes(vendorId)) {
                    parentReferral.Child_referral_ids.push(vendorId);
                    await parentReferral.save();
                }

                if (parentReferral.parentReferral_id) {
                    await addChildToAllParents(vendorId, parentReferral.parentReferral_id);
                }
            }
        }

        if (checkReferral && checkReferral.isActive) {
            checkReferral.Child_referral_ids.push(vendor._id);
            await addChildToAllParents(vendor._id, checkReferral.parentReferral_id);
            await checkReferral.save();
        }

        if (checkReferralFromBh) {
            checkReferralFromBh.vendorIds.push(vendor._id);
            await checkReferralFromBh.save();
        }

        const find = await ActiveReferral_Model.findOne({ contactNumber: number })

        if (find) {
            find.isRegistered = true
            await find.save()
        }


        const emailData = {
            to: email,
            text: `Your OTP is ${otp}`,
        };
        emailData.subject = 'Verify your email';
        await emailService.sendEmail(emailData);

        await insertBh.save();
        await vendor.save();

        res.status(201).json({
            success: true,
            message: 'Vendor registered successfully',
            data: vendor,
            type: 'email',
            email: vendor.email,
            time: vendor.otp_expire_time,
        });
    } catch (error) {
        console.error('Error registering vendor:', error);
        res.status(500).json({
            success: false,
            message: 'Vendor registration failed',
            error: error.message || 'An unexpected error occurred',
        });
    }
};




exports.verifyVendorEmail = async (req, res) => {
    try {
        const { email, otp, type } = req.body;

        // Validate input
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email, OTP are required.',
            });
        }

        // Check if vendor exists
        const vendor = await Vendor_Model.findOne({ email }).populate('member_id', 'category');
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found. Please check the email and try again.',
            });
        }

        if (type === 'email') {
            // Handle email verification
            if (vendor.isEmailVerified) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already verified.',
                });
            }

            if (vendor.otp_ !== otp) {
                return res.status(401).json({
                    success: false,
                    message: 'The provided OTP is invalid. Please check and try again.',
                });
            }

            if (vendor.otp_expire_time && new Date() > vendor.otp_expire_time) {
                return res.status(401).json({
                    success: false,
                    message: 'The OTP has expired. Please request a new OTP.',
                });
            }

            // Update vendor's email verified status
            vendor.isEmailVerified = true;
            vendor.otp_ = null;
            vendor.otp_expire_time = null;
            const emailService = new SendEmailService();

            const emailData = {
                to: email,
                text: `        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4CAF50; text-align: center;">Welcome to Olyox Pvt Ltd!</h2>
            <p>Dear <strong>${vendor.name || 'Vendor'}</strong>,</p>
            <p>Congratulations on completing your onboarding process with us!</p>
            <p><strong>Here are your details:</strong></p>
            <ul style="list-style: none; padding: 0;">
                <li><strong>Vendor BH ID:</strong> ${vendor.myReferral}</li>
                <li><strong>Plan:</strong> ${vendor.member_id?.title || 'Not Assigned'}</li>
                <li><strong>Category:</strong> ${vendor.category?.title || 'Not Specified'}</li>
                <li><strong>Mobile Number:</strong> ${vendor.number || 'Not Provided'}</li>
            </ul>
            <p style="color: #e74c3c;"><strong>Note:</strong> Please ensure to recharge your ID from your dashboard to continue enjoying our services.</p>
            <p style="text-align: center;">
                <a href="${process.env.FrontEndUrl}/login" 
                   style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
                   Go to Dashboard
                </a>
            </p>
                     <p>Best Regards,<br>Olyox Pvt Ltd</p>

        </div>
`,
            };
            emailData.subject = 'onboarding complete';
            await emailService.sendEmail(emailData);

            await vendor.save();

            return res.status(200).json({
                success: true,
                message: 'Email has been verified successfully.',
            });

        } else if (type === 'password') {
            // Handle password OTP verification
            if (vendor.password_otp !== otp) {
                return res.status(401).json({
                    success: false,
                    message: 'The provided OTP is invalid. Please check and try again.',
                });
            }

            if (vendor.password_otp_expire && new Date() > vendor.password_otp_expire) {
                return res.status(401).json({
                    success: false,
                    message: 'The OTP has expired. Please request a new OTP.',
                });
            }

            // Clear password OTP and update password if temporary password exists
            vendor.password_otp = null;
            vendor.password_otp_expire = null;

            if (vendor.temp_password) {
                vendor.password = vendor.temp_password;
                vendor.temp_password = null;
            }

            await vendor.save();

            return res.status(200).json({
                success: true,
                message: 'Password OTP verified successfully. Your password has been updated.',
            });

        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid type. Please provide a valid type (email or password).',
            });
        }

    } catch (error) {
        console.error('Error verifying vendor email:', error);

        // Provide a user-friendly error message
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while verifying your email or OTP. Please try again later.',
        });
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
        let vendor = await Vendor_Model.findOne({ myReferral: email }).populate('category', 'Profile_id');
        if (!vendor) {
            vendor = await Vendor_Model.findOne({ number: email }).populate('category', 'Profile_id');
        }


        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found. Please check your email or number and try again.',
            });
        }


        const isPasswordMatch = await vendor.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        if (vendor.isActive === false) {
            return res.status(401).json({
                success: false,
                message: 'Your account has been blocked due to suspicious activity. Please contact the admin for further assistance.'
            });
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
        const provider = await Vendor_Model.findById(id).select('-password').populate('category').populate('member_id').populate('payment_id');
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
        const { email, oldPassword, newPassword } = req.body;

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
        const {
            name,
            email,
            number,
            password,
            category,
            address,
            referral_code_which_applied,
            is_referral_applied,
            member_id,
            VehicleNumber,
        } = req.body;

        console.log(category)
        // Find the vendor by ID
        const vendor = await Vendor_Model.findById(id);

        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }

        // Check if the provided number is already used by another vendor
        if (number) {
            const existingVendor = await Vendor_Model.findOne({ number });
            if (existingVendor && existingVendor._id.toString() !== id) {
                return res.status(400).json({
                    success: false,
                    message: 'Number already exists',
                });
            }
            vendor.number = number; // Update the vendor's number
        }

        // Update vendor fields if they are provided
        if (name) vendor.name = name;
        if (email) vendor.email = email;
        if (VehicleNumber) vendor.VehicleNumber = VehicleNumber;
        if (password) {
            // Hash the password before saving (use a hashing library like bcrypt)
            vendor.password = password; // Replace with hashed password
        }
        if (category) vendor.category = category;
        if (address) vendor.address = address;
        if (referral_code_which_applied !== undefined) vendor.referral_code_which_applied = referral_code_which_applied;
        if (is_referral_applied !== undefined) vendor.is_referral_applied = is_referral_applied;
        if (member_id) vendor.member_id = member_id;

        // Save the updated vendor
        await vendor.save();

        return res.status(200).json({
            success: true,
            message: 'Vendor details updated successfully',
            vendor,
        });
    } catch (error) {
        console.error('Error updating vendor details:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while updating vendor details. Please try again later.',
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


exports.forgetPassword = async (req, res) => {
    try {
        const { number, newPassword } = req.body;

        if (!number || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Number and new password are required.',
            });
        }

        // Find the vendor by number
        const vendor = await Vendor_Model.findOne({ number });
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found. Please check the number and try again.',
            });
        }

        // Generate OTP and expiry time
        const otpService = new OtpService();
        const { otp, expiryTime } = otpService.generateOtp();

        // Send OTP via email
        const emailService = new SendEmailService();
        const emailData = {
            to: vendor.email, // Assuming vendor.email is available
            subject: 'Reset your Password',
            text: `Your OTP for password reset is: ${otp}`,
        };

        try {
            await emailService.sendEmail(emailData);
        } catch (emailError) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email. Please try again later.',
            });
        }

        // Save OTP and expiry time in the database
        vendor.password_otp = otp;
        vendor.password_otp_expire = expiryTime;
        vendor.temp_password = newPassword
        await vendor.save();
        // Respond with success
        return res.status(200).json({
            success: true,
            email: vendor.email,
            time: vendor?.password_otp_expire,
            message: 'OTP has been sent to your email. Please check your inbox.',
        });
    } catch (error) {
        console.error('Error in forgetPassword:', error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred. Please try again later.',
        });
    }
};

exports.getAllVendor = async (req, res) => {
    try {
        const allVednor = await Vendor_Model.find().populate('Child_referral_ids').populate('category').populate('member_id').populate('payment_id');;
        if (!allVednor) {
            return res.status(400).json({
                success: false,
                message: 'No vendor found',
                error: 'No vendor found',
            })
        }
        return res.status(200).json({
            success: true,
            data: allVednor
        })
    } catch (error) {
        console.error('Error in forgetPassword:', error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred. Please try again later.',
        });
    }
}

exports.updateVendorIsActive = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const updatedCategory = await Vendor_Model.findById(id);
        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: 'Vendor not found',
                error: 'Vendor not found'
            })
        }
        updatedCategory.isActive = isActive;
        await updatedCategory.save();
        // console.log("object",updatedCategory)
        res.status(200).json({
            success: true,
            message: 'Vendor Active status updated successfully',
            data: updatedCategory
        })
    } catch (error) {
        console.log("Internal server error", error)
        res.status(500).json({
            success: false,
            message: 'Failed to update vendor toggle',
            error: error.message
        })
    }
}


