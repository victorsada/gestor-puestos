const Meeting = require("../models/meeting");
const Assistant = require("../models/assistant");
const createError = require("http-errors");
const _ = require("lodash");

module.exports.createMeeting = async (req, res) => {
  let assits = []; // assistant's name in req.body
  let assistant = []; //assostant's fetch in model
  const { name, date, time, amountPeople } = req.body;

  try {
    if (!name || !date || !time) {
      throw createError(400, "Name, date and time are required");
    }
    if (req.body.assistants) {
      assist = req.body.assistants.split(",");
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
