const express = require("express");
const {
  createUser,
  login,
  getUser,
  updateUser,
  deleteUser,
  logout,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/", createUser);
router.post("/login", login);
router.get("/", auth, getUser);
router.patch("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);
router.post("/logout", auth, logout);

module.exports = router;
