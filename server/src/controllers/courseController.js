const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      teacher: req.user._id,
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: "Failed to create course" });
  }
};

const listCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate("teacher", "name email")
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

const listAllCourses = async (req, res) => {
  try {
    const filter = req.user.role === "teacher" ? { teacher: req.user._id } : {};
    const courses = await Course.find(filter).populate("teacher", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("teacher", "name email");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch course" });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (req.user.role === "teacher" && course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    Object.assign(course, req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Failed to update course" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (req.user.role === "teacher" && course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Enrollment.deleteMany({ course: course._id });
    await course.deleteOne();
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete course" });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollment = await Enrollment.findOneAndUpdate(
      { student: req.user._id, course: course._id },
      { $setOnInsert: { student: req.user._id, course: course._id } },
      { new: true, upsert: true }
    );

    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: "Failed to enroll" });
  }
};

const myEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate("course")
      .sort({ updatedAt: -1 });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
};

module.exports = {
  createCourse,
  listCourses,
  listAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  myEnrollments,
};
