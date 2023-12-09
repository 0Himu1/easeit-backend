/* eslint-disable no-return-await */
const Customer = require('../schemas/CustomerSchema');
const Lead = require('../schemas/LeadsSchema');
const generateCustomerID = require('./CustomerIdGenerator');

const addCommentToLead = async (leadId, images, comment, name) => {
    console.log(images);
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

function extractLeadData(body, files) {
    const {
        status,
        source,
        creName,
        name,
        phone,
        visitCharge,
        remark,
        meetingData,
        address,
        positive,
        projectStatus,
        projectLocation,
        workScope,
        time,
        date,
    } = body;

    const fileNames = files?.map((file) => file.filename);

    return {
        time,
        date,
        status,
        source,
        creName,
        name,
        phone,
        visitCharge,
        remark,
        meetingData,
        address,
        positive,
        projectStatus,
        projectLocation,
        workScope,
        fileNames,
    };
}

async function createLead(leadData) {
    const newLead = new Lead({
        CID: generateCustomerID(leadData.name, leadData.phone),
        status: leadData.status,
        source: leadData.source,
        creName: leadData.creName,
        name: leadData.name,
        phone: leadData.phone,
        visitCharge: leadData.visitCharge,
        meetingData: {
            time: leadData.time,
            date: leadData.date,
        },
    });

    return await newLead.save();
}

async function createCustomer(lead, leadData) {
    const customerData = {
        CID: lead.CID || generateCustomerID(lead.name, leadData.phone),
        name: leadData.name,
        address: leadData.address,
        phone: leadData.phone,
        projectStatus: leadData.projectStatus,
        projectLocation: leadData.projectLocation,
        workScope: leadData.workScope,
        positive: leadData.positive,
    };

    const newCustomer = new Customer(customerData);
    return await newCustomer.save();
}

module.exports = {
    createCustomer,
    createLead,
    extractLeadData,
    addCommentToLead,
};
