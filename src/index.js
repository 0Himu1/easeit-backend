const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// internal Imports
const { notFoundHandler, errorHandler } = require('./middlewares/common/errorHandler');
const loginRouter = require('./routes/loginRouters');
const settingsRouter = require('./routes/settings/settingsRouter');
const webhookRouter = require('./routes/webhook');
const leadRouter = require('./routes/lead');

// Initilize app
const app = express();
dotenv.config();

// Database connection
mongoose
    .connect(process.env.MONGO_CONNECTION_STRING, {})
    .then(() => console.log('Database connection successfull'))
    .catch((err) => console.log(err, 'Database connection Error'));

// request process
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })
);

// set up EJS
app.set('view engine', 'ejs');

// set public folder
app.use(express.static(path.join(__dirname, '../public')));

// routing setup
app.use('/login', loginRouter);
app.use('/settings', settingsRouter);
app.use('/webhook', webhookRouter);
app.use('/lead', leadRouter);

// 404 error handling
app.use(notFoundHandler);

// Default error handling
app.use(errorHandler);

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`App listening to port ${process.env.PORT}`);
});
