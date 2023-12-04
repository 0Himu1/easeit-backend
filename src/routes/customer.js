// extarnal imports
const express = require('express');
const { default: mongoose } = require('mongoose');
const customerSchema = require('../schemas/CustomerSchema');

// declear router
const customerRouter = express.Router();

// make a model
// eslint-disable-next-line new-cap
const Customer = new mongoose.model('customer', customerSchema);

// get facebook settings
customerRouter.get('/', (req, res) => {
    Customer.find({})
        .then((result) => res.status(200).json(result))
        .catch(() => res.status(500).json({ error: 'There was a server side error' }));
});

// post facebook settings
customerRouter.post('/', async (req, res) => {
    console.log(req.body);
    const newCustomerData = {
        ...req.body,
    };

    const newCustomer = new Customer(newCustomerData);

    try {
        const savedLead = await newCustomer.save();
        res.status(200).json({ message: 'Lead Added Successfully', lead: savedLead });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'There was a server side error' });
    }
});

// PUT endpoint
customerRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    // eslint-disable-next-line object-curly-newline
    const { phone, important, visitCharge, remark, nextCallData, meetingData } = req.body;

    try {
        // Use findById to get the lead by ID
        const lead = await Lead.findById(id);

        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        // Now you can access lead.name
        const result = await Lead.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    CID: lead.CID || generateCustomerID(lead.name, phone),
                    phone,
                    important,
                    visitCharge,
                    remark,
                    nextCallData,
                    meetingData,
                },
            },
            { upsert: true, new: true, runValidators: true }
        );

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'There was a server side error', message: error.message });
    }
});

// delete facebook settings
customerRouter.delete('/:id', (req, res) => {
    Lead.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'lead Deleted successfully' }))
        .catch(() => res.status(500).json({ error: 'There was a server side error' }));
});

module.exports = customerRouter;
