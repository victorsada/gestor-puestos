const Assistant = require("../models/assistant");
const createError = require("http-errors");
const _ = require("lodash");
const { filter } = require("lodash");

module.exports.createAssistant = async (req, res) => {
  try {
    if (!req.body.name) {
      throw createError(400, "Name is required");
    }
    if (req.body.sex) {
      if (req.body.sex !== "masculino" && req.body.sex !== "femenino") {
        throw createError(400, 'Sex must be "Masculino or Femenino" ');
      }
    }

    const assistantExist = await Assistant.findOne({ name: req.body.name });
    if (assistantExist) {
      throw createError(409, `Assistant ${req.body.name} already exist`);
    }
    const assistant = new Assistant(req.body);
    await assistant.save();
    res.status(200).send(assistant);
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.getAssistats = async (req, res) => {
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

    const assistant = await Assistant.find(filter)
      .limit(parseInt(limit))
      .skip(parseInt(startIndex))
      .sort(order);

    if (assistant.length === 0) {
      throw createError(404, "No assistent found, go to create one!");
    }

    res.status(200).send(assistant);
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};
module.exports.getAssistat = async (req, res) => {
  try {
    const assistant = await Assistant.findById({ _id: req.params.id });
    if (!assistant) {
      throw createError(404, `Assistant not found`);
    }
    res.status(200).send(assistant);
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.updateAssistant = async (req, res) => {
  try {
    if (req.body.name) {
      const assistantExist = await Assistant.findOne({ name: req.body.name });
      if (assistantExist) {
        throw createError(409, `Assistant ${req.body.name} is already exist`);
      }
    }
    const assistant = await Assistant.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!assistant) {
      throw createError(404, "Assistant not found.");
    }
    res
      .status(201)
      .send({
        message: `Assistant ${assistant.name} was updated successfully`,
        "Assistant updated:": assistant,
      });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.deleteAssistant = (req, res) => {
  try {
    Assistant.findByIdAndRemove({ _id: req.params.id })
      .then((assistant) => {
        res.status(200).send({
          Message: `Assistant ${assistant.name} was deleted successfully`,
        });
      })
      .catch((error) => {
        res.status(404).send({ msg: "Assistant not found" });
      });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};
