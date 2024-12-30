const Withdraw = require('../model/Withdraw.history.model'); // Import the Withdraw model
const Vendor = require('../model/vendor');


exports.createWithdrawal = async (req, res) => {
    try {
        const user = req.user.id?._id
        console.log(user)
        const { amount, method, BankDetails, upi_details } = req.body;
        console.log("req.body", req.body)
        // Check for required fields
        if (!amount || !method) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // Validate withdrawal method
        if (!['Bank Transfer', 'UPI'].includes(method)) {
            return res.status(400).json({ success: false, message: 'Invalid withdrawal method.' });
        }

        // Fetch vendor details
        const vendor = await Vendor.findById(user);
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found.' });
        }

        // Validate amount against vendor's wallet balance
        if (amount > vendor.wallet) {
            return res.status(400).json({ success: false, message: 'Insufficient wallet balance.' });
        }

        // Deduct the amount from vendor's wallet
        vendor.wallet -= amount;

        // Create withdrawal request
        const newWithdrawal = new Withdraw({
            vendor_id: user,
            amount,
            method,
            BankDetails: method === 'Bank Transfer' ? BankDetails : undefined,
            upi_details: method === 'UPI' ? upi_details : undefined,
            status: 'Pending', // Default status is 'Pending'
        });

        // Save vendor and withdrawal updates
        await vendor.save();
        await newWithdrawal.save();

        res.status(201).json({
            success: true,
            message: 'Withdrawal request created successfully.',
            withdrawal: newWithdrawal,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};



exports.approveWithdrawal = async (req, res) => {
    try {
        const { id } = req.params;
        const { trn_no, time_of_payment_done } = req.body;

        // Fetch withdrawal request and populate vendor details
        const withdrawal = await Withdraw.findById(id).populate('vendor_id');
        if (!withdrawal) {
            return res.status(404).json({ success: false, message: 'Withdrawal not found.' });
        }

        // Ensure withdrawal is in a valid state for approval
        if (withdrawal.status !== 'Pending') {
            return res.status(400).json({ success: false, message: 'Only pending withdrawals can be approved.' });
        }

        // Check if the vendor has enough balance in the wallet
        if (withdrawal.vendor_id.wallet < withdrawal.amount) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient wallet balance for this withdrawal.'
            });
        }

        // Update withdrawal status and vendor wallet
        withdrawal.status = 'Approved';
        withdrawal.trn_no = trn_no;
        withdrawal.time_of_payment_done = time_of_payment_done || new Date();
        withdrawal.vendor_id.wallet -= withdrawal.amount;

        // Save withdrawal and vendor updates
        await withdrawal.vendor_id.save(); // Save vendor wallet update
        await withdrawal.save(); // Save withdrawal status update

        res.status(200).json({
            success: true,
            message: 'Withdrawal approved successfully.',
            withdrawal,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};


exports.rejectWithdrawal = async (req, res) => {
    try {
        const { id } = req.params;
        const { cancelReason } = req.body;

        // Find the withdrawal request by ID
        const withdrawal = await Withdraw.findById(id).populate('vendor_id');
        if (!withdrawal) {
            return res.status(404).json({ success: false, message: 'Withdrawal not found.' });
        }

        // Check if the withdrawal status is 'Pending'
        if (withdrawal.status !== 'Pending') {
            return res.status(400).json({ success: false, message: 'Only pending withdrawals can be rejected.' });
        }

        // Revert the amount back to the vendor's wallet
        const vendor = withdrawal.vendor_id;
        if (vendor) {
            vendor.wallet += withdrawal.amount;
            await vendor.save();
        }

        // Update withdrawal status and add cancel reason
        withdrawal.status = 'Rejected';
        withdrawal.cancelReason = cancelReason;

        await withdrawal.save();

        res.status(200).json({
            success: true,
            message: 'Withdrawal rejected successfully, and the amount has been reverted to the vendor\'s wallet.',
            withdrawal,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};


exports.cancelWithdrawal = async (req, res) => {
    try {
        const { id } = req.params;
        const { cancelReason } = req.body;

        // Find the withdrawal request by ID
        const withdrawal = await Withdraw.findById(id).populate('vendor_id');
        if (!withdrawal) {
            return res.status(404).json({ success: false, message: 'The requested withdrawal could not be found.' });
        }

        // Check if the withdrawal status is 'Pending'
        if (withdrawal.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: 'This withdrawal request is already processed and cannot be cancelled.'
            });
        }

        // Revert the amount back to the vendor's wallet
        const vendor = withdrawal.vendor_id;
        if (vendor) {
            vendor.wallet += withdrawal.amount;
            await vendor.save();
        }

        // Update withdrawal status and add cancel reason
        withdrawal.status = 'Cancelled';
        withdrawal.cancelReason = cancelReason;

        await withdrawal.save();

        res.status(200).json({
            success: true,
            message: `The withdrawal request has been successfully cancelled. ${withdrawal.amount} has been added back to your wallet.`,
            withdrawal,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while cancelling the withdrawal request. Please try again later.'
        });
    }
};


exports.cancelWithdrawal = async (req, res) => {
    try {
        const { id } = req.params;
        const { cancelReason } = req.body;

        // Find the withdrawal request by ID
        const withdrawal = await Withdraw.findById(id).populate('vendor_id');
        if (!withdrawal) {
            return res.status(404).json({ success: false, message: 'The requested withdrawal could not be found.' });
        }

        // Check if the withdrawal status is 'Pending'
        if (withdrawal.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: 'This withdrawal request is already processed and cannot be cancelled.'
            });
        }

        // Revert the amount back to the vendor's wallet
        const vendor = withdrawal.vendor_id;
        if (vendor) {
            vendor.wallet += withdrawal.amount;
            await vendor.save();
        }

        // Update withdrawal status and add cancel reason
        withdrawal.status = 'Cancelled';
        withdrawal.cancelReason = cancelReason;

        await withdrawal.save();

        res.status(200).json({
            success: true,
            message: `The withdrawal request has been successfully cancelled. ${withdrawal.amount} has been added back to your wallet.`,
            withdrawal,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while cancelling the withdrawal request. Please try again later.'
        });
    }
};


exports.getAllWithdrawals = async (req, res) => {
    try {
        const { status } = req.query; // Optional filter by status

        const query = status ? { status } : {};
        const withdrawals = await Withdraw.find(query).populate('vendor_id', 'name email');

        res.status(200).json({
            success: true,
            message: 'Withdrawals fetched successfully.',
            withdrawals,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};


exports.getWithdrawalById = async (req, res) => {
    try {
        const user = req.user.id._id

        const withdrawal = await Withdraw.find({ vendor_id: user })
            .populate('vendor_id')
            .sort({ createdAt: -1 });


        // If withdrawal is not found
        if (!withdrawal) {
            return res.status(404).json({ success: false, message: 'Withdrawal not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Withdrawal details fetched successfully.',
            withdrawal,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};


exports.getPendingWithdrawals = async (req, res) => {
    try {
        // Find all withdrawals with status 'Pending'
        const pendingWithdrawals = await Withdraw.find({ status: 'Pending' }).populate('vendor_id');

        if (!pendingWithdrawals || pendingWithdrawals.length === 0) {
            return res.status(404).json({ success: false, message: 'No pending withdrawals found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Pending withdrawal requests fetched successfully.',
            withdrawals: pendingWithdrawals,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error while fetching pending withdrawals.' });
    }
};