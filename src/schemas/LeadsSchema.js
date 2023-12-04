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
                'need-support',
                'msg-reschedule',
                'number-collected',
                'call-rescheduled',
                'future-client',
                'meeting-fixed',
                'meeting-rescheduled',
                'cancel-meeting-request',
            ],
            default: 'unread',
        },
        lastMsg: {
            type: String,
            required: true,
        },
        source: {
            type: String,
            enum: ['facebook', 'whatsapp', 'web', 'by phone', 'manual'],
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
        phone: {
            type: String,
        },
        visitCharge: {
            type: Number,
        },
        remark: {
            type: String,
        },
        meetingData: {
            type: {
                time: String,
                date: Date,
            },
        },
        cData: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'customer',
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

module.exports = leadSchema;
