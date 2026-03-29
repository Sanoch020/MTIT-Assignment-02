const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  email: { type: String, required: true },
  age:   { type: Number, required: true },
  grade: { type: String, required: true },
}, { versionKey: false, toJSON: { transform: (doc, ret) => { delete ret.__v; return ret; } } });

module.exports = mongoose.model("Student", studentSchema);
