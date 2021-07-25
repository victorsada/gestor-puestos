const mongoose = require("mongoose");
const Assistant = require("./assistant");

const meetingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    amountPeople: {
      type: Number,
    },
    assistants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assistant" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Meeting", meetingSchema);
