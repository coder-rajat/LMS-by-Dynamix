const express = require("express");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/roles");
const {
  createQuiz,
  listCourseQuizzes,
  submitQuiz,
  myAttempts,
} = require("../controllers/quizController");

const router = express.Router();

router.get("/course/:courseId", auth, listCourseQuizzes);
router.post("/", auth, requireRole(["teacher", "admin"]), createQuiz);
router.post("/:quizId/submit", auth, requireRole(["student"]), submitQuiz);
router.get("/attempts/mine", auth, requireRole(["student"]), myAttempts);

module.exports = router;
