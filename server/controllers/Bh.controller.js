const BhModel = require('../model/Partner.model');
const crypto = require('crypto');
const vendor = require('../model/vendor');

function generateBhId() {
    const randomNum = crypto.randomInt(100000, 999999);
    return `BH${randomNum}`;
}

// Create BH ID
exports.createBhId = async (req, res) => {
    try {
        const newBhId = generateBhId();

        // Save to the database
        const newBhRecord = new BhModel({
            BhId: newBhId,
        });

        await newBhRecord.save();

        res.status(201).json({
            success: true,
            message: 'BH ID created successfully',
            data: newBhRecord,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating BH ID',
            error: error.message,
        });
    }
};

// Update BH ID
exports.updateBhId = async (req, res) => {
    try {
        const { id } = req.params; // ID from request parameters
        const updateData = req.body; // Data to update

        const updatedRecord = await BhModel.findByIdAndUpdate(id, updateData, {
            new: true, // Return the updated document
        });

        if (!updatedRecord) {
            return res.status(404).json({
                success: false,
                message: 'BH ID not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'BH ID updated successfully',
            data: updatedRecord,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating BH ID',
            error: error.message,
        });
    }
};

// Delete BH ID
exports.deleteBhId = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRecord = await BhModel.findByIdAndDelete(id);

        if (!deletedRecord) {
            return res.status(404).json({
                success: false,
                message: 'BH ID not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'BH ID deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting BH ID',
            error: error.message,
        });
    }
};

// Toggle Status
exports.toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await BhModel.findById(id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'BH ID not found',
            });
        }

        // Toggle the `status` field
        record.status = !record.status;
        await record.save();

        res.status(200).json({
            success: true,
            message: 'BH status toggled successfully',
            data: record,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error toggling status',
            error: error.message,
        });
    }
};


exports.checkBhId = async (req, res) => {
    try {
        const { bh } = req.body;

        // Step 1: Try to find BH ID in BhModel
        let bhId = await BhModel.findOne({ BhId: bh });

        // Step 2: If not found, try finding in vendor.myReferral
        if (!bhId) {
            const vendorData = await vendor.findOne({ myReferral: bh }).select('-password');

            if (!vendorData) {
                return res.status(404).json({
                    success: false,
                    message: 'BH ID not found in BH model or vendor referrals',
                });
            }

            bhId = { BhId: vendorData.myReferral, isActive: vendorData.isActive };
        }

        // Step 3: Check if BH ID is active
        if (bhId.isActive) {
            const findDetails = await vendor.findOne({ myReferral: bhId.BhId })
                .select('-password')
                .populate('category')
                .populate('member_id')
                .populate('payment_id')
                .populate('copyParentId')
                .populate({
                    path: 'Level1',
                    populate: [
                        { path: 'Child_referral_ids' },
                        { path: 'category' },
                        { path: 'payment_id' },
                        { path: 'member_id' }
                    ],
                })
                .populate({
                    path: 'Level2',
                    populate: [
                        { path: 'Child_referral_ids' },
                        { path: 'category' },
                        { path: 'payment_id' },
                        { path: 'member_id' }
                    ],
                })
                .populate({
                    path: 'Level3',
                    populate: [
                        { path: 'Child_referral_ids' },
                        { path: 'category' },
                        { path: 'payment_id' },
                        { path: 'member_id' }
                    ],
                })
                .populate({
                    path: 'Level4',
                    populate: [
                        { path: 'Child_referral_ids' },
                        { path: 'category' },
                        { path: 'payment_id' },
                        { path: 'member_id' }
                    ],
                })
                .populate({
                    path: 'Level5',
                    populate: [
                        { path: 'Child_referral_ids' },
                        { path: 'category' },
                        { path: 'payment_id' },
                        { path: 'member_id' }
                    ],
                })
                .populate({
                    path: 'Level6',
                    populate: [
                        { path: 'Child_referral_ids' },
                        { path: 'category' },
                        { path: 'payment_id' },
                        { path: 'member_id' }
                    ],
                })
                .populate({
                    path: 'Level7',
                    populate: [
                        { path: 'Child_referral_ids' },
                        { path: 'category' },
                        { path: 'payment_id' },
                        { path: 'member_id' }
                    ],
                });

            if (findDetails?.isActive === false) {
                return res.status(200).json({
                    success: false,
                    message: 'This BH ID has been blocked by the admin due to suspicious activity. Please contact support for assistance.',
                });
            }

            if (findDetails) {
                return res.status(200).json({
                    success: true,
                    message: `BH ID found With Name ${findDetails.name} and is active`,
                    data: findDetails.name,
                    complete: findDetails
                });
            } else {
                return res.status(200).json({
                    success: false,
                    message: 'BH ID is not active',
                });
            }

        } else {
            return res.status(200).json({
                success: false,
                message: 'BH ID is not active',
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while checking BH ID',
            error: error.message,
        });
    }
};

exports.getDetailsViaBh = async (req, res) => {
    try {
        const { Bh } = req.query;

        if (!Bh) {
            return res.status(400).json({
                success: false,
                message: 'BH ID is required',
            });
        }

        const findDetails = await vendor.findOne({ myReferral: Bh }).populate('category').populate('member_id');

        if (findDetails) {
            return res.status(200).json({
                success: true,
                message: 'Vendor found successfully',
                data: findDetails,  // Returning the found vendor details
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'No vendor found with this BH ID',
            });
        }

    } catch (error) {
        console.error('Error fetching vendor details:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
