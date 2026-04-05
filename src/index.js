const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log(`gameify-backend-services running on http://localhost:${PORT}`);
});
