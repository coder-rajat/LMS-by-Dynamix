const express = require("express");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/roles");
const {
  createCourse,
  listCourses,
  listAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  myEnrollments,
} = require("../controllers/courseController");
const { updateProgress } = require("../controllers/progressController");

const router = express.Router();

router.get("/public", listCourses);
router.get("/mine", auth, myEnrollments);

router.post("/", auth, requireRole(["teacher", "admin"]), createCourse);
router.get("/", auth, requireRole(["teacher", "admin"]), listAllCourses);
router.get("/:id", auth, getCourse);
router.put("/:id", auth, requireRole(["teacher", "admin"]), updateCourse);
router.delete("/:id", auth, requireRole(["teacher", "admin"]), deleteCourse);

router.post("/:id/enroll", auth, requireRole(["student"]), enrollCourse);
router.put("/:id/progress", auth, requireRole(["student"]), updateProgress);

module.exports = router;
