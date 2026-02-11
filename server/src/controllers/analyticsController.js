const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const QuizAttempt = require("../models/QuizAttempt");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalAttempts,
      avgProgress,
      roleBreakdown,
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      QuizAttempt.countDocuments(),
      Enrollment.aggregate([
        { $group: { _id: null, avgProgress: { $avg: "$progressPercent" } } },
      ]),
      User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
      ]),
    ]);

    const progressValue = avgProgress[0]?.avgProgress || 0;

    res.json({
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalAttempts,
      avgProgress: Math.round(progressValue),
      roleBreakdown,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load analytics" });
  }
};

module.exports = { getDashboardStats };
