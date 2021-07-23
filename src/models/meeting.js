const mongoose = require("mongoose");

const meetingSchema = mongoose.Schema(
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
    // assistants: [
    //   {
    //     assistant: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Assistant",
    //     },
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Meeting", meetingSchema);
