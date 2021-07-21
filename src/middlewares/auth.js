const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const userValidated = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ _id: userValidated._id, token });

    req.user = user;
    req.token = user.token;
    next();
  } catch (error) {
    res.status(401).send({ error: "No estas autorizado" });
  }
};

module.exports = auth;
