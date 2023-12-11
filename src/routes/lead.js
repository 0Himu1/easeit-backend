/* eslint-disable prettier/prettier */
/* eslint-disable no-return-await */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const upload = require('../config/multerconfig');
const Lead = require('../schemas/LeadsSchema');
const generateCustomerID = require('../helpers/CustomerIdGenerator');
const {
  addCommentToLead,
  extractLeadData,
  createLead,
  createCustomer,
} = require('../helpers/leadFunctions');

const leadRouter = express.Router();

leadRouter.get('/', async (req, res) => {
  try {
    const leads = await Lead.find({});
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ error: 'There was a server side error' });
  }
});

leadRouter.post('/', upload.array('images'), async (req, res) => {
    try {
      const leadData = extractLeadData(req.body, req.files);

      // Perform any necessary validation checks
      // ...

      const newLead = new Lead({
        CID: leadData.phone ? generateCustomerID(leadData.name, leadData.phone) : '',
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
        address: leadData.address,
        projectStatus: leadData.projectStatus,
        projectLocation: leadData.projectLocation,
        workScope: leadData.workScope,
        positive: leadData.positive,
      });

      const savedLead = await newLead.save();

      res.status(200).json({
        message: 'New Lead Added Successfully',
        lead: savedLead,
      });
    } catch (error) {
      console.error(error);

      // Provide a more specific error message based on the nature of the error
      let errorMessage = 'There was a server side error';
      if (error.name === 'ValidationError') {
        errorMessage = 'Validation error. Please check your input.';
      }

      res.status(500).json({ error: errorMessage });
    }
  });

leadRouter.post('/comment/:id', upload.array('images'), async (req, res) => {
  try {
    const leadData = extractLeadData(req.body, req.files);
    const { id } = req.params;

    const { comment: savedComment } = await addCommentToLead(
      id,
      leadData.fileNames,
      leadData.remark,
      leadData.creName
    );

    res.status(200).json({ message: 'Comment added successfully', savedComment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'There was a server side error' });
  }
});

leadRouter.put('/:id', upload.array('file', 3), async (req, res) => {
  try {
    const { id } = req.params;
    const {
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
        nextMsgData,
        nextCallData
    } = extractLeadData(req.body, req.files);

    await addCommentToLead(id, fileNames, remark, creName);

    switch (status) {
        case 'need-support':
            try {
                // Update Lead Status
                const savedChangedStatus = await Lead.findOneAndUpdate(
                    { _id: id },
                    {
                        $set: {
                            status,
                        },
                    },
                    { upsert: true, new: true, runValidators: true }
                );

                // Send response
                if (!res.headersSent) {
                    res.status(200).json({
                        message: 'Status Updated Successfully',
                        updatedLead: savedChangedStatus,
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
        case 'no-response':
            try {
                // Update Lead Status
                const savedChangedStatus = await Lead.findOneAndUpdate(
                    { _id: id },
                    {
                        $set: {
                            status,
                        },
                    },
                    { upsert: true, new: true, runValidators: true }
                );

                // Send response
                if (!res.headersSent) {
                    res.status(200).json({
                        message: 'Status Updated Successfully',
                        updatedLead: savedChangedStatus,
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
                        },
                    },
                    { upsert: true, new: true, runValidators: true }
                );

                // Send response
                if (!res.headersSent) {
                    res.status(200).json({
                        message: 'Phone number added Successfully',
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
                            status,
                            CID: lead.CID || generateCustomerID(lead.name, phone),
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
                            status,
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
                                phone: phone || lead.phone,
                                status,
                                meetingData,
                                visitCharge,
                                projectLocation,
                                projectStatus,
                                workScope,
                                address,
                                positive,
                            },
                        },
                        { upsert: true, new: true, runValidators: true }
                    );

                    // Send response
                    if (!res.headersSent) {
                        res.status(200).json({
                            message: 'Meeting Scheduled Successfully',
                            updatedLead: meetingSetData,
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'There was a server side error',
      message: error.message,
    });
  }
});

leadRouter.delete('/:id', async (req, res) => {
  try {
    await Lead.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Lead Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'There was a server side error' });
  }
});

module.exports = leadRouter;
