const express = require('express');
const cors = require('cors');
const { verifyToken } = require('./middleware/auth');
const usersRouter = require('./routes/users');
const backgroundsRouter = require('./routes/backgrounds');
const bannersRouter = require('./routes/banners');
const iconsRouter = require('./routes/icons');
const wrappersRouter = require('./routes/wrappers');

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(verifyToken);

app.use('/users', usersRouter);
app.use('/backgrounds', backgroundsRouter);
app.use('/banners', bannersRouter);
app.use('/icons', iconsRouter);
app.use('/wrappers', wrappersRouter);

module.exports = app;
