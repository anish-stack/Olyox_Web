const mongoose = require('mongoose')

const CommissionTDS = new mongoose.Schema({
    tdsPercentage: {
        type: Number,
        required: true,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    withdrawCommision: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true })

module.exports = mongoose.model('CommissionTDS', CommissionTDS)