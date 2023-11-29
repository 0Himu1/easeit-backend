// extarnal imports
const express = require('express');
const { default: mongoose } = require('mongoose');
const settingsSchema = require('../../schemas/SettingsSchema');
const facebookRouter = require('./endpoints/facebook');

// declear router
const settingsRouter = express.Router();

// add subrouters
settingsRouter.use('/facebook', facebookRouter);

// make a model
// eslint-disable-next-line new-cap
const Settings = new mongoose.model('setting', settingsSchema);

settingsRouter.get('/', (req, res) => {
    res.send('Settings Page');
});

module.exports = settingsRouter;
