const mongoose = require("mongoose");
const Meeting = require("./assistant");
const assistantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
    },
    birthday: {
      type: Date,
    },
    adress: {
      type: String,
    },
    telf: {
      type: String,
    },
    sex: {
      type: String,
      lowercase: true,
    },
    member: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Assistant", assistantSchema);
