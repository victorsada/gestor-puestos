const Meeting = require("../models/meeting");
const createError = require("http-errors");

module.exports.createMeeting = async (req, res) => {
  try {
    if (!req.body.name || !req.body.date || !req.body.time) {
      throw createError(400, "Name, date and time are required");
    }
    const meeting = new Meeting(req.body);
    await meeting.save();
    res.status(200).send(meeting);
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find();

    if (meetings.length === 0) {
      throw createError(404, "Meetings not found, go to create one");
    }

    res.status(200).send({ total: meetings.length, meetings });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.getMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById({ _id: req.params.id });
    if (!meeting) {
      throw createError(
        404,
        `Meeting with id ${req.params.id} could not found`
      );
    }
    res.status(200).send(meeting);
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!meeting) {
      throw createError(
        404,
        `Meeting with id ${req.params.id} could not found`
      );
    }
    res.status(201).send(meeting);
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.deleteMeeting = async (req, res) => {
  try {
    Meeting.findByIdAndRemove({ _id: req.params.id })
      .then((deleted) => {
        res
          .status(200)
          .send({ Message: `Meeting ${deleted.name} was deleted successfuly` });
      })
      .catch((error) => {
        console.log(error);
        res
          .status(404)
          .send({ Messae: `Meeting with id ${req.params.id} could not found` });
      });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};
