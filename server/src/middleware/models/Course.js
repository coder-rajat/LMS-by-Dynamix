const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["video", "article", "quiz", "assignment"], default: "article" },
    content: { type: String, default: "" },
    durationMinutes: { type: Number, default: 0 },
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: "General" },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    thumbnailUrl: { type: String, default: "" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lessons: [lessonSchema],
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
