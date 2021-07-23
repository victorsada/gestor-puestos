const express = require("express");
const auth = require("../middlewares/auth");
const {
  createMeeting,
  getMeetings,
  getMeeting,
  updateMeeting,
  deleteMeeting,
} = require("../controllers/meetingController");

const router = express.Router();

router.post("/", auth, createMeeting);
router.get("/", auth, getMeetings);
router.get("/:id", auth, getMeeting);
router.patch("/:id", auth, updateMeeting);
router.delete("/:id", auth, deleteMeeting);
module.exports = router;
