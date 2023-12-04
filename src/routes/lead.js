/* eslint-disable new-cap */
// extarnal imports
const express = require('express');
const { default: mongoose } = require('mongoose');
const leadSchema = require('../schemas/LeadsSchema');
const generateCustomerID = require('../helpers/CustomerIdGenerator');
const customerSchema = require('../schemas/CustomerSchema');

// declear router
const leadRouter = express.Router();

// make a model
const Lead = new mongoose.model('lead', leadSchema);
const Customer = new mongoose.model('customer', customerSchema);

// get facebook settings
leadRouter.get('/', (req, res) => {
    Lead.find({})
        .then((result) => res.status(200).json(result))
        .catch(() => res.status(500).json({ error: 'There was a server side error' }));
});

// post facebook settings
leadRouter.post('/', async (req, res) => {
    console.log(req.body);

    const newLead = new Lead(req.body);

    try {
        const savedLead = await newLead.save();
        res.status(200).json({ message: 'Lead Added Successfully', lead: savedLead });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'There was a server side error' });
    }
});

// PUT endpoint
leadRouter.put('/:id', async (req, res) => {
    console.log(req.body);
    // destarcture all property from request body and params
    const { id } = req.params;
    const {
        phone,
        status,
        meetingData,
        nextMsgData,
        remark,
        visitCharge,
        nextCallData,
        address,
        projectStatus,
        projectLocation,
        workScope,
        positive,
    } = req.body;

    switch (status) {
        case 'need-support':
            try {
                // Update Lead Status
                const meetingRescheduleResult = await Lead.findOneAndUpdate(
                    { _id: id },
                    {
                        $set: {
                            status,
                            remark,
                        },
                    },
                    { upsert: true, new: true, runValidators: true }
                );

                // Send response
                if (!res.headersSent) {
                    res.status(200).json({
                        message: 'Meeting rescheduled Successfully',
                        updatedLead: meetingRescheduleResult,
                    });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    error: 'There was a server side error',
                    message: error.message,
                });
            }
            break;
        case 'msg-reschedule':
            try {
                // Update Lead with data
                const msgRescheduleResult = await Lead.findOneAndUpdate(
                    { _id: id },
                    {
                        $set: {
                            nextMsgData,
                            status,
                            remark,
                        },
                    },
                    { upsert: true, new: true, runValidators: true }
                );

                // Send response
                if (!res.headersSent) {
                    res.status(200).json({
                        message: 'Message rescheduled Successfully',
                        updatedLead: msgRescheduleResult,
                    });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    error: 'There was a server side error',
                    message: error.message,
                });
            }
            break;
        case 'number-collected':
            try {
                // Use findById to get the lead data by ID
                const lead = await Lead.findById(id);

                if (!lead) {
                    return res.status(404).json({ error: 'Lead not found' });
                }
                // Update Lead with data
                const meetingRescheduleResult = await Lead.findOneAndUpdate(
                    { _id: id },
                    {
                        $set: {
                            CID: lead.CID || generateCustomerID(lead.name, phone),
                            phone,
                            status,
                            remark,
                        },
                    },
                    { upsert: true, new: true, runValidators: true }
                );

                // Send response
                if (!res.headersSent) {
                    res.status(200).json({
                        message: 'Meeting rescheduled Successfully',
                        updatedLead: meetingRescheduleResult,
                    });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    error: 'There was a server side error',
                    message: error.message,
                });
            }
            break;
        case 'call-rescheduled':
            try {
                // Use findById to get the lead data by ID
                const lead = await Lead.findById(id);

                if (!lead) {
                    return res.status(404).json({ error: 'Lead not found' });
                }

                // Update Lead with data
                const callRescheduleResult = await Lead.findOneAndUpdate(
                    { _id: id },
                    {
                        $set: {
                            CID: lead.CID || generateCustomerID(lead.name, phone),
                            phone,
                            remark,
                            nextCallData,
                        },
                    },
                    { upsert: true, new: true, runValidators: true }
                );

                // Send response
                if (!res.headersSent) {
                    res.status(200).json({
                        message: 'Call rescheduled Successfully',
                        updatedLead: callRescheduleResult,
                    });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    error: 'There was a server side error',
                    message: error.message,
                });
            }
            break;
        case 'future-client':
            try {
                // Use findById to get the lead data by ID
                const lead = await Lead.findById(id);

                if (!lead) {
                    return res.status(404).json({ error: 'Lead not found' });
                }

                // Update Lead with data
                const callRescheduleResult = await Lead.findOneAndUpdate(
                    { _id: id },
                    {
                        $set: {
                            CID: lead.CID || generateCustomerID(lead.name, phone),
                            remark,
                            status,
                        },
                    },
                    { upsert: true, new: true, runValidators: true }
                );

                // Send response
                if (!res.headersSent) {
                    res.status(200).json({
                        message: 'Call rescheduled Successfully',
                        updatedLead: callRescheduleResult,
                    });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    error: 'There was a server side error',
                    message: error.message,
                });
            }
            break;
        case 'meeting-fixed':
            try {
                // if call is complete tnen update Lead and make a new customer collection
                if (address && projectStatus && projectLocation && positive && workScope) {
                    // Use findById to get the lead data by ID
                    const lead = await Lead.findById(id);

                    if (!lead) {
                        return res.status(404).json({ error: 'Lead not found' });
                    }

                    // Update Lead with data
                    const meetingSetData = await Lead.findOneAndUpdate(
                        { _id: id },
                        {
                            $set: {
                                phone,
                                status,
                                meetingData,
                                visitCharge,
                                remark,
                            },
                        },
                        { upsert: true, new: true, runValidators: true }
                    );

                    // Add a new Customer in customer collection
                    const newCustomerData = {
                        CID: lead.CID || generateCustomerID(lead.name, phone),
                        name: lead.name,
                        address,
                        phone,
                        projectStatus,
                        projectLocation,
                        workScope,
                        positive,
                    };

                    const newCustomer = new Customer(newCustomerData);
                    const savedCustomer = await newCustomer.save();

                    // Send response
                    if (!res.headersSent) {
                        res.status(200).json({
                            message: 'Meeting Scheduled Successfully',
                            updatedLead: meetingSetData,
                            customer: savedCustomer,
                        });
                    }
                } else {
                    // Send response saying data missing in request
                    res.status(400).json({ message: 'Data missing in request' });
                }
            } catch (error) {
                res.status(500).json({
                    error: 'There was a server side error',
                    message: error.message,
                });
            }
            break;
        case 'meeting-rescheduled':
            try {
                // Update Lead with data
                const meetingRescheduleResult = await Lead.findOneAndUpdate(
                    { _id: id },
                    {
                        $set: {
                            meetingData,
                            status,
                            remark,
                        },
                    },
                    { upsert: true, new: true, runValidators: true }
                );

                // Send response
                if (!res.headersSent) {
                    res.status(200).json({
                        message: 'Meeting rescheduled Successfully',
                        updatedLead: meetingRescheduleResult,
                    });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    error: 'There was a server side error',
                    message: error.message,
                });
            }
            break;
        case 'cancel-meeting-request':
            try {
                // Update Lead with data
                const meetingRescheduleResult = await Lead.findOneAndUpdate(
                    { _id: id },
                    {
                        $set: {
                            meetingData: {
                                time: '',
                                date: '',
                            },
                            status,
                            remark,
                        },
                    },
                    { upsert: true, new: true, runValidators: true }
                );

                // Send response
                if (!res.headersSent) {
                    res.status(200).json({
                        message: 'Meeting cencel request submitted Successfully',
                        updatedLead: meetingRescheduleResult,
                    });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    error: 'There was a server side error',
                    message: error.message,
                });
            }
            break;
        default:
            break;
    }
});

// delete facebook settings
leadRouter.delete('/:id', (req, res) => {
    Lead.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'lead Deleted successfully' }))
        .catch(() => res.status(500).json({ error: 'There was a server side error' }));
});

module.exports = leadRouter;