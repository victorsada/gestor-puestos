const express = require("express");
const {
  getAssistat,
  createAssistant,
} = require("../controllers/assistantController");
const router = express.Router();

router.post("/", createAssistant);
router.get("/", getAssistat);

module.exports = router;
