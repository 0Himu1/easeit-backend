// extarnal imports
const express = require('express');
const { default: mongoose } = require('mongoose');
const webhookSchema = require('../schemas/webhookSchema');

// declear router
const webhookRouter = express.Router();

// make a model
// eslint-disable-next-line new-cap
const Webhook = new mongoose.model('webhook-lead', webhookSchema);

// get facebook settings
webhookRouter.get('/', (req, res) => {
    Webhook.findAll({})
        .then((result) => res.status(200).json(result))
        .catch(() => res.status(500).json({ error: 'There was a server side error' }));
});

// post facebook settings
webhookRouter.post('/', async (req, res) => {
    console.log(req.body);
    const newFbSettings = new Webhook(req.body);

    try {
        const savedSettings = await newFbSettings.save();
        res.status(200).json({ message: 'Lead Added Successfully', settings: savedSettings });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'There was a server side error' });
    }
});

// put facebook settings
webhookRouter.put('/:id', async (req, res) => {
    const { name, settingsData } = req.body;

    // try {
    //     // Use findOneAndUpdate with upsert: true to update or insert a document
    //     const result = await Webhook.findOneAndUpdate(
    //         { name },
    //         { $set: { settingsData } },
    //         { upsert: true, new: true, runValidators: true }
    //     );

    //     res.json(result);
    // } catch (error) {
    //     res.status(500).json({ error: 'There was a server side error' });
    // }
});

// delete facebook settings
webhookRouter.delete('/:id', (req, res) => {
    Webhook.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'lead Deleted successfully' }))
        .catch(() => res.status(500).json({ error: 'There was a server side error' }));
});

module.exports = webhookRouter;
