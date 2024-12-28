const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define Vendor Schema
const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    number: {
        type: String,
        required: [true, 'Phone Number is required'],
        match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    address: {
        area: {
            type: String,
          
        },
        street_address: {
            type: String,
            
        },
        landmark: {
            type: String,
          
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
            }
        },
        pincode: {
            type: String,
          
        }
    },
    workMode: {
        type: Boolean,
        default: false
    },
    order_id: {
        type: String,
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    payment_id: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    member_id: {
        type: String,
        required: [true, 'Member ID is required']
    },
    referral_ids: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Vendor',
        default: []
    },
    is_referral_applied: {
        type: Boolean,
        default: false
    },
    referral_code_which_applied: {
        type: String
    },
    my_referral_id: {
        type: String
    },
    level_id: {
        type: String,
        default: null
    },
    otp_: {
        type: String,
        default: null
    },
    otp_expire_time: {
        type: Date,
        default: null
    },
    password_otp: {
        type: String,
        default: null
    },
    password_otp_expire: {
        type: Date,
        default: null
    },
    partner_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: 'partner',
    },
    is_top_member: {
        type: Boolean,
        default: false
    },
    VehicleNumber: {
        type: String,
        default: null
    },
    Documents: {
        documentFirst: {
            image: {
                type: String,
                required: true
            },
            public_id: {
                type: String,
                required: true
            }
        },
        documentSecond: {
            image: {
                type: String,
                required: true
            },
            public_id: {
                type: String,
                required: true
            }
        }
    },
    Profile_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    },
    review: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Review',
        default: []
    }
}, { timestamps: true });

vendorSchema.index({ 'address.location': '2dsphere' });
vendorSchema.index({ number: 1 });


vendorSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

vendorSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Vendor', vendorSchema);
