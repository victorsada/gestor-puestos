const express = require("express");
const auth = require("../middlewares/auth");
const {
  createMeeting,
  getMeeting,
} = require("../controllers/meetingController");

const router = express.Router();

router.post("/", auth, createMeeting);
router.get("/", auth, getMeeting);

module.exports = router;
