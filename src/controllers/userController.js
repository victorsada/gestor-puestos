const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports.createUser = async (req, res) => {
  try {
    if (!req.body.email || !req.body.name || !req.body.password) {
      throw createError(400, "Name, Email and Password are required");
    }
    //validate unique email
    const userExist = await User.findOne({
      email: req.body.email.toLowerCase().trim(),
    });
    if (userExist) {
      if (userExist.email == req.body.email.toLowerCase().trim()) {
        throw createError(409, "This user already exist");
      }
    }

    const user = new User(req.body);
    //Hash Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    //Generate Token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    user.token = token;

    await user.save();
    res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      throw createError(400, "Email and Password are required");
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw createError(404, "User not exist");
    }
    //verify password
    const passwordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordCorrect) {
      throw createError(409, "Password incorrect");
    }

    const token = await jwt.sign({ _id: user._id }, process.env.SECRET);
    user.token = token;
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.find();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    if (!user) {
      throw createError(404, "User not found");
    }
    //Hash Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    console.log(user);
    res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const userExist = await User.findById({ _id: req.params.id });
    if (!userExist) {
      throw createError(404, "User not found");
    }
    User.findByIdAndRemove({ _id: userExist._id })
      .then(() => {
        res
          .status(200)
          .send({ msg: `User ${userExist.name} was deleted successfully` });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};

module.exports.logout = async (req, res) => {
  try {
    const user = req.user;
    user.token = null;
    await user.save();

    res.status(200).send({ msg: `User ${user.name} is logout` });
  } catch (error) {
    console.log(error);
    res.status(error.status).send(error);
  }
};
