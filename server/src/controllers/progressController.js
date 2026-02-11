const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Certificate = require("../models/Certificate");
const { generateCertificatePdf } = require("../utils/certificate");
const { sendEmail } = require("../utils/email");
const { randomUUID } = require("crypto");

const updateProgress = async (req, res) => {
  try {
    const { progressPercent = 0, completedLessonId } = req.body;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled" });
    }

    enrollment.progressPercent = Math.min(100, Math.max(0, progressPercent));
    if (completedLessonId && !enrollment.completedLessons.includes(completedLessonId)) {
      enrollment.completedLessons.push(completedLessonId);
    }
    enrollment.lastAccessedAt = new Date();

    await enrollment.save();

    if (enrollment.progressPercent >= 100) {
      const existing = await Certificate.findOne({ student: req.user._id, course: courseId });
      if (!existing) {
        const certificateId = randomUUID();
        const issuedAt = new Date();
        const { filePath } = await generateCertificatePdf({
          studentName: req.user.name,
          courseTitle: course.title,
          certificateId,
          issuedAt,
        });

        const certificate = await Certificate.create({
          certificateId,
          student: req.user._id,
          course: courseId,
          filePath,
          issuedAt,
        });

        await sendEmail({
          to: req.user.email,
          subject: `Certificate issued for ${course.title}`,
          html: `<p>Congrats ${req.user.name},</p><p>Your certificate has been issued for ${course.title}.</p>`,
        });

        return res.json({ enrollment, certificate });
      }
    }

    res.json({ enrollment });
  } catch (err) {
    res.status(500).json({ message: "Failed to update progress" });
  }
};

module.exports = { updateProgress };
