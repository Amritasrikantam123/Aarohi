const mongoose = require("mongoose");

const CareerGuidanceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  titleEn: { type: String, required: true },
  titleHi: { type: String },
  titleTe: { type: String },
  icon: { type: String, default: "BookOpen" },
  descriptionEn: { type: String, required: true },
  descriptionHi: { type: String },
  descriptionTe: { type: String },
  roadmap: [{
    step: { type: Number, required: true },
    titleEn: { type: String, required: true },
    titleHi: { type: String },
    titleTe: { type: String },
    detailEn: { type: String, required: true },
    detailHi: { type: String },
    detailTe: { type: String }
  }],
  skillsEn: [{ type: String }],
  skillsHi: [{ type: String }],
  skillsTe: [{ type: String }],
  courses: [{
    nameEn: { type: String, required: true },
    nameHi: { type: String },
    nameTe: { type: String },
    platform: { type: String, required: true },
    duration: { type: String, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model("CareerGuidance", CareerGuidanceSchema);
