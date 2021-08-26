const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(
      process.env.URL_DB,
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
      () => {
        console.log("Database connected");
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;
