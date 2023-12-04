const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
    {
        CID: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
        },
        phone: {
            type: String,
            required: true,
        },
        projectStatus: {
            type: String,
            enum: ['ready', 'ongoing', 'recently'],
        },
        projectLocation: {
            type: String,
            enum: ['inside', 'outside'],
        },
        workScope: {
            type: String,
            enum: [
                'kitchen cabinet',
                'cabinet',
                'false ceiling',
                'tv unit',
                'dinner wagon',
                'study unit',
                'full interior',
                'design consultancy',
                'customized furniture',
            ],
        },
        meetingDone: {
            type: Boolean,
        },
        positive: {
            type: Boolean,
        },
        projectConfirmation: {
            type: String,
            enum: ['pending', 'confirm', 'cancel'],
        },
        reschedule: {
            type: {
                time: String,
                date: Date,
            },
        },
        sqft: {
            type: Number,
        },
        rate: {
            type: Number,
        },
        discount: {
            type: Number,
        },
        totalAmount: {
            type: Number,
            default: 0, // Default value for discount
            validate: {
                validator() {
                    return this.sqft && this.rate;
                },
                message: 'Both sqft and rate are required to calculate totalAmount.',
            },
            set(value) {
                // Calculate totalAmount only if sqft and rate are provided
                if (this.sqft && this.rate) {
                    return this.sqft * this.rate * ((100 - this.discount) / 100);
                }
                return value;
            },
        },
        mbSheetNo: {
            type: String,
        },
        transportCost: {
            type: Number,
        },
        remark: {
            type: String,
        },
        lData: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'lead',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = customerSchema;
