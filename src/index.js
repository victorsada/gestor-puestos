const express = require('express');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const app = express();
const cors = require('cors');
app.set('port', process.env.PORT || 3000);
const dbConnect = require('./config/db');
dbConnect();
app.use(cors());
app.use(express.json());
app.use('/api/user', require('./routes/user'));
app.use('/api/assistant', require('./routes/assistant'));
app.use('/api/meeting', require('./routes/meeting'));
app.use((error, req, res, next) => {
  res.status(error.status);
  res.json({
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
});

const server = app.listen(app.get('port'), () => {
  console.log(`Server is up on port ${app.get('port')}`);
});

module.exports = { app, server };
