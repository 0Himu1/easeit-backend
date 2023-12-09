/* eslint-disable new-cap */
const mongoose = require('mongoose');

// - unread
// - need support
// - msg reschedule
// - number collected
// - call reschedule
// - meeting fixed
// - cancel meeting request

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
        cData: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'customer',
        },
        creName: {
            type: String,
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

// leadSchema.path('name').validate({
//     async validator(value) {
//         const count = await this.model('setting').countDocuments({ name: value });
//         return count === 0;
//     },
//     message: 'The name must be unique within the enum values.',
// });

const Lead = new mongoose.model('lead', leadSchema);

module.exports = Lead;
