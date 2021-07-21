const mongoose = require("mongoose");

const dbConnect = async () => {
  //const url = "mongodb://127.0.0.1:27017/api-iglesia";

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
        console.log("Base de datos conectada!!");
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;
