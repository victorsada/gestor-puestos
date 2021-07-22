const express = require("express");
const auth = require("../middlewares/auth");
const {
  getAssistats,
  createAssistant,
  getAssistat,
  updateAssistant,
  deleteAssistant,
} = require("../controllers/assistantController");
const router = express.Router();

router.post("/", auth, createAssistant);
router.get("/", auth, getAssistats);
router.get("/:id", auth, getAssistat);
router.patch("/:id", auth, updateAssistant);
router.delete("/:id", auth, deleteAssistant);

module.exports = router;
