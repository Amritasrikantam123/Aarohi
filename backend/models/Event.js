const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, default: "Online" },
  speaker: { type: String },
  type: { type: String, enum: ["Webinar", "Workshop", "Seminar", "General"], default: "Webinar" },
  registeredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  registeredVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
