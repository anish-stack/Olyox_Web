const CommissionTDS = require('../model/commission.model')

exports.createCommissionTDS = async (req, res) => {
    try {
        const { tdsPercentage, withdrawCommision } = req.body;
        const newCommissionTDS = new CommissionTDS({ tdsPercentage, withdrawCommision });
        await newCommissionTDS.save();
        res.status(201).json({ success: true, message: 'CommissionTDS created successfully', data: newCommissionTDS });
    } catch (error) {
        console.log("Internal server error", error);
        res.status(500).json({ success: false, message: 'Failed to create CommissionTDS', error: error.message });
    }
};

exports.getSingleCommissionTDS = async (req,res) => {
    try {
        const commissionTDS = await CommissionTDS.findById(req.params.id);
        if (!commissionTDS) {
            return res.status(404).json({ success: false, message: 'CommissionTDS not found' });
        }
        res.status(200).json({ success: true, data: commissionTDS });
    } catch (error) {
        console.log("Internal server error", error);
        res.status(500).json({ success: false, message: 'Failed to get CommissionTDS', error: error.message });
    }
}

exports.updateCommissionTDS = async (req, res) => {
    try {
        console.log("req.body", req.body);
        const updatedCommissionTDS = await CommissionTDS.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCommissionTDS) {
            return res.status(404).json({ success: false, message: 'CommissionTDS not found' });
        }
        res.status(200).json({ success: true, message: 'CommissionTDS updated successfully', data: updatedCommissionTDS });
    } catch (error) {
        console.log("Internal server error", error);
        res.status(500).json({ success: false, message: 'Failed to update CommissionTDS', error: error.message });
    }
}