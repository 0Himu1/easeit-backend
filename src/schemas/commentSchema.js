const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
    {
        image: [String],
        comment: String,
        name: String,
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model.comment || mongoose.model('comment', commentSchema);
module.exports = Comment;
