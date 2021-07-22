const Meeting = require("../models/meeting");
const createError = require("http-errors");

module.exports.createMeeting = async (req, res) => {
  try {
    const meeting = new Meeting(req.body);
    if (!meeting) {
      throw createError(400, "bad request");
    }
    await meeting.save();
    res.status(200).send(meeting);
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.getMeeting = async (req, res) => {
  const meeting = await Meeting.find();
  res.send(meeting);
};
