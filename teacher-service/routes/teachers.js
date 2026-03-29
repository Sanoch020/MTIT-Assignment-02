const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Teacher = require("../models/teacherModel");

// ─── Swagger Schema Definition ────────────────────────────────────────────────
/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - subject
 *         - qualification
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated teacher ID
 *           example: 1
 *         name:
 *           type: string
 *           description: Full name of the teacher
 *           example: Dr. Kasun Wickrama
 *         email:
 *           type: string
 *           description: Teacher email address
 *           example: kasun@school.lk
 *         subject:
 *           type: string
 *           description: Subject the teacher is assigned to
 *           example: Mathematics
 *         qualification:
 *           type: string
 *           description: Highest academic qualification
 *           example: PhD
 */

// ─── GET ALL TEACHERS ─────────────────────────────────────────────────────────
/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Retrieve all teachers
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: List of all teachers
 */
router.get("/", async (req, res) => {
  const teachers = await Teacher.find();
  res.json({ success: true, count: teachers.length, data: teachers });
});

// ─── GET TEACHER BY ID ────────────────────────────────────────────────────────
/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Get a teacher by ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The teacher ID
 *     responses:
 *       200:
 *         description: Teacher found
 *       404:
 *         description: Teacher not found
 */
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ success: false, message: "Invalid teacher ID" });
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found" });
  res.json({ success: true, data: teacher });
});

// ─── CREATE TEACHER ───────────────────────────────────────────────────────────
/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Create a new teacher
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       201:
 *         description: Teacher created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/", async (req, res) => {
  const { name, email, subject, qualification } = req.body;
  if (!name || !email || !subject || !qualification)
    return res.status(400).json({ success: false, message: "All fields required: name, email, subject, qualification" });

  const existing = await Teacher.findOne({ email });
  if (existing)
    return res.status(400).json({ success: false, message: "Teacher with this email already exists" });

  const teacher = await Teacher.create({ name, email, subject, qualification });
  res.status(201).json({ success: true, message: "Teacher created", data: teacher });
});

// ─── UPDATE TEACHER ───────────────────────────────────────────────────────────
/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Update an existing teacher
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The teacher ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 *       404:
 *         description: Teacher not found
 */
router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ success: false, message: "Invalid teacher ID" });
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found" });
  res.json({ success: true, message: "Teacher updated", data: teacher });
});

// ─── DELETE TEACHER ───────────────────────────────────────────────────────────
/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Delete a teacher by ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The teacher ID
 *     responses:
 *       200:
 *         description: Teacher deleted successfully
 *       404:
 *         description: Teacher not found
 */
router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ success: false, message: "Invalid teacher ID" });
  const teacher = await Teacher.findByIdAndDelete(req.params.id);
  if (!teacher) return res.status(404).json({ success: false, message: "Teacher not found" });
  res.json({ success: true, message: "Teacher deleted", data: teacher });
});

module.exports = router;
