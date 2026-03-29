const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  studentId:      { type: Number, required: true },
  courseId:       { type: Number, required: true },
  enrollmentDate: { type: String, required: true },
  status:         { type: String, enum: ["Active", "Completed", "Dropped"], required: true },
}, { versionKey: false, toJSON: { transform: (doc, ret) => { delete ret.__v; return ret; } } });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
