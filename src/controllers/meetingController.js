const Meeting = require("../models/meeting");
const Assistant = require("../models/assistant");
const createError = require("http-errors");
const _ = require("lodash");
const mongoose = require("mongoose");

module.exports.createMeeting = async (req, res) => {
  let assistant = []; //assostant's fetch in model
  const { name, date, time, amountPeople } = req.body;

  try {
    if (!name || !date || !time) {
      throw createError(400, "Name, date and time are required");
    }
    const meetExist = await Meeting.findOne({ name });
    if (meetExist) {
      throw createError(409, `Assistant ${name} already exist`);
    }
    if (req.body.assistants) {
      const assist = req.body.assistants.split(",");
      assistant = await Assistant.find({ name: assist });
    }
    const meeting = new Meeting({
      name,
      date,
      time,
      amountPeople,
    });

    assistant.forEach((item) => {
      meeting.assistants.push(item);
    });

    await meeting.save();
    res.status(200).send(meeting);
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.getMeetings = async (req, res) => {
  const sortBy = req.query.sortBy;
  const sortDirection = req.query.sortDirection;
  const filterBy = req.query.filterBy;
  const filterValues = req.query.filterValues;
  const limit = req.query.limit;
  const page = req.query.page;
  const startIndex = (page - 1) * limit;
  let order;
  let filter;
  try {
    if (sortBy && sortDirection) {
      const orderBy = sortBy.split();
      const orderDirection = sortDirection.split();
      order = _.zipObject(orderBy, orderDirection);
    }

    if (filterBy && filterValues) {
      const filterField = filterBy.split();
      const filterValue = filterValues.split();
      filter = _.zipObject(filterField, filterValue);
    }
    const meetings = await Meeting.find(filter)
      .limit(parseInt(limit))
      .skip(parseInt(startIndex))
      .sort(order);

    if (meetings.length === 0) {
      throw createError(404, "Meetings not found, go to create one");
    }

    const meeting = meetings.map((meet) => {
      return {
        id: meet._id,
        name: meet.name,
        date: meet.date,
        time: meet.time,
        amountPeople: meet.amountPeople,
      };
    });

    res.status(200).send({
      total: meeting.length,
      meeting,
    });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.getMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById({ _id: req.params.id }).populate(
      "assistants",
      "name"
    );
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
  let assits = []; // assistant's name in req.body
  let assistant = []; //assostant's fetch in model
  const { name, date, time, amountPeople } = req.body;
  try {
    if (req.body.assistants) {
      assist = req.body.assistants.split(",");
      assistant = await Assistant.find({ name: assist });
    }

    const meeting = await Meeting.findById({ _id: req.params.id });
    if (!meeting) {
      throw createError(
        404,
        `Meeting with id ${req.params.id} could not found`
      );
    }
    assistant.forEach((item) => {
      meeting.assistants.forEach((element) => {
        if (element.toString() == item._id.toString()) {
          throw createError(400, `${item.name} already belong to the meeting`);
        }
      });

      meeting.assistants.push(item);
    });
    name ? (meeting.name = name) : null;
    date ? (meeting.date = date) : null;
    time ? (meeting.time = time) : null;
    amountPeople ? (meeting.amountPeople = amountPeople) : null;
    meeting.save();
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

module.exports.meet = async (req, res) => {
  try {
    const meetAssist = new MeetAssist(req.body);
    meetAssist.save();
    res.send(meetAssist);
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.getMeet = async (req, res) => {
  try {
    res.send("its woerk");
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.deleteAssistantFromMeeting = async (req, res) => {
  const { name, meeting } = req.body;
  let err;
  try {
    if (!name || !meeting) {
      throw createError(
        400,
        "You must specify the *NAME* of the assistant and the name of de *MEETING*"
      );
    }
    const assistant = await Assistant.findOne({ name });
    if (!assistant) {
      throw createError(404, `The assistant ${name} could not be found`);
    }
    const meet = await Meeting.findOne({ name: meeting });
    if (!meet) {
      throw createError(404, `The meeting ${meeting} could not be found`);
    }

    if (meet.assistants.length == 0) {
      throw createError(404, `There is not assistants in the meeting`);
    }

    for (let i = 0; i < meet.assistants.length; i++) {
      err =
        meet.assistants[i].toString() == assistant._id.toString()
          ? "THIS ASSISTANT EXIST"
          : null;
      if (err) {
        break;
      }
    }
    if (!err) {
      throw createError(
        404,
        `${assistant.name} does not belong to this meeting`
      );
    }

    const indexToDelete = meet.assistants.indexOf(assistant._id);
    if (indexToDelete > -1) {
      meet.assistants.splice(indexToDelete, 1);
    }

    const response = `${assistant.name} was deleted from ${meeting}`;
    await meet.save();

    res.send({ message: response });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};
