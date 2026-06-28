const mongoose = require("mongoose");

const GovernmentSchemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  eligibility: {
    minMarks: { type: Number, default: 0 },
    maxIncome: { type: Number, default: 9999999 },
    classRequired: { type: String, default: "Any" },
    categoryRequired: { type: String, default: "All" }
  },
  state: { type: String, default: "All" },
  applyLink: { type: String },
  provider: { type: String, default: "Government of India" }
}, { timestamps: true });

module.exports = mongoose.model("GovernmentScheme", GovernmentSchemeSchema);
