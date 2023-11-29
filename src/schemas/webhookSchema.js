const mongoose = require('mongoose');

const webhookSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        eamil: {
            type: String,
            require: true,
        },
        phone: String,
        messege: String,
    },
    {
        timestamps: true,
    }
);

// webhookSchema.path('name').validate({
//     async validator(value) {
//         const count = await this.model('setting').countDocuments({ name: value });
//         return count === 0;
//     },
//     message: 'The name must be unique within the enum values.',
// });

module.exports = webhookSchema;
