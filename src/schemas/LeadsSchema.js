/* eslint-disable new-cap */
const mongoose = require('mongoose');

const leadSchema = mongoose.Schema(
    {
        CID: {
            type: String,
        },
        name: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: [
                'unread',
                'No Response',
                'Message Rescheduled',
                'Need Support',
                'Number Collected',
                'Call Reschedule',
                'Future Client',
                'Meeting Fixed',
                'Meeting Reschedule',
                'Cancel Meeting',
            ],
            default: 'unread',
            require: true,
        },
        lastMsg: {
            type: String,
        },
        source: {
            type: String,
            enum: ['Facebook', 'WhatsApp', 'Web', 'By Phone'],
            required: true,
        },

        nextCallData: {
            type: {
                time: String,
                date: Date,
            },
        },
        nextMsgData: {
            type: {
                time: String,
                date: Date,
            },
        },
        meetingData: {
            type: {
                time: String,
                date: Date,
            },
        },
        phone: {
            type: String,
        },
        visitCharge: {
            type: Number,
        },
        comment: [
            {
                images: [String],
                comment: String,
                name: String,
                date: Date,
            },
        ],
        creName: {
            type: String,
            require: true,
        },
        // Customer details
        address: {
            type: String,
        },
        projectStatus: {
            type: String,
            enum: ['Ready', 'Ongoing', 'Recently'],
        },
        projectLocation: {
            type: String,
            enum: ['Inside', 'Outside'],
        },
        workScope: {
            type: String,
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
            default: 0,
            validate: {
                validator() {
                    return this.sqft && this.rate;
                },
                message: 'Both sqft and rate are required to calculate totalAmount.',
            },
            set(value) {
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
    },
    {
        timestamps: true,
    }
);

const Lead = new mongoose.model('lead', leadSchema);

module.exports = Lead;
