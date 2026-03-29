const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Student = require("../models/studentModel");

// ─── Swagger Schema Definition ────────────────────────────────────────────────
/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - age
 *         - grade
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated student ID
 *           example: 1
 *         name:
 *           type: string
 *           description: Full name of the student
 *           example: Amal Perera
 *         email:
 *           type: string
 *           description: Student email address
 *           example: amal@school.lk
 *         age:
 *           type: integer
 *           description: Age of the student
 *           example: 20
 *         grade:
 *           type: string
 *           description: Current academic grade
 *           example: A
 */

// ─── GET ALL STUDENTS ─────────────────────────────────────────────────────────
/**
 * @swagger
 * /students:
 *   get:
 *     summary: Retrieve all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of all students
 */
router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json({ success: true, count: students.length, data: students });
});

// ─── GET STUDENT BY ID ────────────────────────────────────────────────────────
/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     responses:
 *       200:
 *         description: Student found
 *       404:
 *         description: Student not found
 */
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ success: false, message: "Invalid student ID" });
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: "Student not found" });
  res.json({ success: true, data: student });
});

// ─── CREATE STUDENT ───────────────────────────────────────────────────────────
/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/", async (req, res) => {
  const { name, email, age, grade } = req.body;
  if (!name || !email || !age || !grade)
    return res.status(400).json({ success: false, message: "All fields required" });
  
  const existing = await Student.findOne({ email });
  if (existing)
    return res.status(400).json({ success: false, message: "Student with this email already exists" });
  
  const student = await Student.create({ name, email, age, grade });
  res.status(201).json({ success: true, message: "Student created", data: student });
});

// ─── UPDATE STUDENT ───────────────────────────────────────────────────────────
/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update an existing student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       404:
 *         description: Student not found
 */
router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ success: false, message: "Invalid student ID" });
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!student) return res.status(404).json({ success: false, message: "Student not found" });
  res.json({ success: true, message: "Student updated", data: student });
});

// ─── DELETE STUDENT ───────────────────────────────────────────────────────────
/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 */
router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ success: false, message: "Invalid student ID" });
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: "Student not found" });
  res.json({ success: true, message: "Student deleted", data: student });
});

module.exports = router;
