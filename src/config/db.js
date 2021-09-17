const mongoose = require('mongoose');

const dbConnect = async () => {
  const connectionString =
    process.env.NODE_ENV === 'test'
      ? process.env.URL_DB_TEST
      : process.env.URL_DB;
  try {
    await mongoose.connect(
      connectionString,
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
      () => {
        console.log('Database connected');
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;
