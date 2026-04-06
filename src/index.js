const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');
const backgroundsRouter = require('./routes/backgrounds');
const bannersRouter = require('./routes/banners');
const iconsRouter = require('./routes/icons');
const wrappersRouter = require('./routes/wrappers');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/users', usersRouter);
app.use('/backgrounds', backgroundsRouter);
app.use('/banners', bannersRouter);
app.use('/icons', iconsRouter);
app.use('/wrappers', wrappersRouter);

app.listen(PORT, () => {
  console.log(`gameify-backend-services running on http://localhost:${PORT}`);
});
