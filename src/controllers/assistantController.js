const Assistant = require("../models/assistant");
const createError = require("http-errors");

module.exports.createAssistant = async (req, res) => {
  try {
    if (!req.body.name) {
      throw createError(400, "Name is required");
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
  try {
    const assistant = await Assistant.find();

    if (!assistant[0]) {
      throw createError(404, "No assistent found, go to create one!");
    }

    res.status(200).send({ "Total Assistant": assistant.length, assistant });
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
    const assistant = await Assistant.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!assistant) {
      throw createError(404, "Assistant not found.");
    }
    res.status(201).send({ "Assistant updated:": assistant });
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
