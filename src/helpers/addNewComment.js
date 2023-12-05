const Lead = require('../schemas/LeadsSchema');

const addCommentToLead = async (leadId, images, comment, name) => {
    if (comment && name) {
        try {
            const lead = await Lead.findById(leadId);

            if (!lead) {
                throw new Error('Lead not found');
            }

            const newComment = {
                images,
                comment,
                name,
                date: new Date(),
            };

            lead.comment.push(newComment);
            await lead.save();

            return { success: true, lead };
        } catch (error) {
            console.error('Error adding comment:', error);
            return { success: false, error: error.message || 'Internal Server Error' };
        }
    }
};

module.exports = {
    addCommentToLead,
};
