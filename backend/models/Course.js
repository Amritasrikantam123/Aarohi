const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  provider: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String },
  syllabus: [{ type: String }],
  studentsCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = mongoose.model("Course", CourseSchema);
