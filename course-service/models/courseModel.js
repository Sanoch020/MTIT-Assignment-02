const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  credits:     { type: Number, required: true },
  duration:    { type: String, required: true },
}, { versionKey: false, toJSON: { transform: (doc, ret) => { delete ret.__v; return ret; } } });

module.exports = mongoose.model("Course", courseSchema);
