const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  opportunity: { type: mongoose.Schema.Types.ObjectId, ref: "Opportunity", required: true },
  status: { type: String, enum: ["Applied", "Pending", "Approved", "Rejected"], default: "Applied" },
  appliedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  remarks: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Application", ApplicationSchema);
