const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true },
  subject:       { type: String, required: true },
  qualification: { type: String, required: true },
}, { versionKey: false, toJSON: { transform: (doc, ret) => { delete ret.__v; return ret; } } });

module.exports = mongoose.model("Teacher", teacherSchema);
