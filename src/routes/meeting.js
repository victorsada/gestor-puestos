const express = require("express");
const {
  createMeeting,
  getMeeting,
} = require("../controllers/meetingController");

const router = express.Router();

router.post("/", createMeeting);
router.get("/", getMeeting);

module.exports = router;
