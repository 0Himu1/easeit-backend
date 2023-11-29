// extarnal imports
const express = require('express');
const { default: mongoose } = require('mongoose');
const settingsSchema = require('../../../schemas/SettingsSchema');

// declear router
const facebookRouter = express.Router();

// make a model
// eslint-disable-next-line new-cap
const Settings = new mongoose.model('setting', settingsSchema);

// get facebook settings
facebookRouter.get('/', (req, res) => {
    Settings.find({ name: 'facebook' })
        .then((result) => res.status(200).json(result))
        .catch(() => res.status(500).json({ error: 'There was a server side error' }));
});

// post facebook settings
facebookRouter.post('/', async (req, res) => {
    const newFbSettings = new Settings(req.body);

    try {
        const savedSettings = await newFbSettings.save();
        res.status(200).json({ message: 'Settings Added Successfully', settings: savedSettings });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'There was a server side error' });
    }
});

// put facebook settings
facebookRouter.put('/', async (req, res) => {
    const { name, settingsData } = req.body;

    try {
        // Use findOneAndUpdate with upsert: true to update or insert a document
        const result = await Settings.findOneAndUpdate(
            { name },
            { $set: { settingsData } },
            { upsert: true, new: true, runValidators: true }
        );

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'There was a server side error' });
    }
});

// delete facebook settings
facebookRouter.delete('/', (req, res) => {
    Settings.deleteOne({ name: 'facebook' })
        .then(() => res.status(200).json({ message: 'settings Deleted successfully' }))
        .catch(() => res.status(500).json({ error: 'There was a server side error' }));
});

module.exports = facebookRouter;
