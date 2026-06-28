const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "mentor", "ngo", "volunteer", "admin"], default: "student" },
  
  // Student specific fields
  age: { type: Number },
  school: { type: String },
  class: { type: String },
  district: { type: String },
  state: { type: String },
  familyIncome: { type: Number },
  contact: { type: String },
  careerInterests: { type: [String], default: [] },
  academicRecords: {
    type: [{
      examName: String,
      year: Number,
      marksPercentage: Number,
      status: String
    }],
    default: []
  },
  appliedScholarships: {
    type: [{
      scholarshipId: String,
      appliedDate: String,
      status: String
    }],
    default: []
  },
  bookedSessions: {
    type: [{
      mentorId: String,
      mentorName: String,
      date: String,
      time: String,
      status: String
    }],
    default: []
  },
  badges: { type: [String], default: [] },
  avatar: { type: String, default: "" },
  bio: { type: String, default: "" },
  achievements: { type: [String], default: [] },
  certifications: { type: [String], default: [] },
  featuredStory: {
    isFeatured: { type: Boolean, default: false },
    quoteEn: { type: String, default: "" },
    quoteHi: { type: String, default: "" },
    quoteTe: { type: String, default: "" },
    approved: { type: Boolean, default: false }
  },

  // Saved Opportunities (Array of Opportunity IDs)
  savedOpportunities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Opportunity" }],

  // Career Guidance Progress Tracking
  careerProgress: {
    type: Map,
    of: {
      completedSteps: [Number], // e.g. [1, 2]
      enrolledCourses: [String], // Course names or IDs
      status: String // In Progress, Completed
    },
    default: {}
  },

  // Mentor specific fields
  organization: { type: String },
  field: { type: String },
  languages: { type: [String], default: [] },
  experience: { type: String },
  proof: { type: String },
  status: { type: String, enum: ["pending", "approved", "suspended"], default: "pending" },

  // General fields for Resetting Password
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

// Hash password before saving
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
