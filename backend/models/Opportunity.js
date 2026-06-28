const mongoose = require("mongoose");

const OpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  eligibility: {
    minMarks: { type: Number, default: 0 },
    maxIncome: { type: Number, default: 9999999 },
    classRequired: { type: String, default: "Any" },
    description: { type: String }
  },
  location: { type: String, default: "Remote" },
  applyLink: { type: String },
  provider: { type: String, required: true },
  type: { type: String, enum: ["Scholarship", "Internship", "Workshop", "Competition", "Fellowship", "Government Scheme", "Skill Program", "Certification"], required: true },
  duration: { type: String },
  stipend: { type: String, default: "None" },
  date: { type: String },
  category: { type: String, default: "General" }, // Government, NGO, Private
  state: { type: String, default: "All" },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Opportunity", OpportunitySchema);
