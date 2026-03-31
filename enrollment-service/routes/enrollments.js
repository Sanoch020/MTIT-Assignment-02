const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Enrollment = require("../models/enrollmentModel");

// ─── Swagger Schema Definition ────────────────────────────────────────────────
/**
 * @swagger
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       required:
 *         - studentId
 *         - courseId
 *         - courseName
 *         - enrollmentDate
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated enrollment ID
 *           example: 1
 *         studentId:
 *           type: integer
 *           description: ID of the enrolled student
 *           example: 1
 *         courseId:
 *           type: integer
 *           description: ID of the course being enrolled in
 *           example: 1
 *         courseName:
 *           type: string
 *           description: Name of the course
 *           example: Mathematics
 *         enrollmentDate:
 *           type: string
 *           format: date
 *           description: Date the student enrolled
 *           example: 2026-01-10
 *         status:
 *           type: string
 *           enum: [Active, Completed, Dropped]
 *           description: Current enrollment status
 *           example: Active
 */

// ─── GET ALL ENROLLMENTS ──────────────────────────────────────────────────────
/**
 * @swagger
 * /enrollments:
 *   get:
 *     summary: Retrieve all enrollments
 *     tags: [Enrollments]
 *     responses:
 *       200:
 *         description: List of all enrollments
 */
router.get("/", async (req, res) => {
  const enrollments = await Enrollment.find();
  res.json({ success: true, count: enrollments.length, data: enrollments });
});

// ─── GET ENROLLMENT BY ID ─────────────────────────────────────────────────────
/**
 * @swagger
 * /enrollments/{id}:
 *   get:
 *     summary: Get an enrollment by ID
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment found
 *       404:
 *         description: Enrollment not found
 */
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ success: false, message: "Invalid enrollment ID" });
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) return res.status(404).json({ success: false, message: "Enrollment not found" });
  res.json({ success: true, data: enrollment });
});

// ─── CREATE ENROLLMENT ────────────────────────────────────────────────────────
/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Create a new enrollment
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Enrollment'
 *     responses:
 *       201:
 *         description: Enrollment created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/", async (req, res) => {
  const { studentId, courseId, courseName, enrollmentDate, status } = req.body;
  if (!studentId || !courseId || !courseName || !enrollmentDate || !status)
    return res.status(400).json({ success: false, message: "All fields required: studentId, courseId, courseName, enrollmentDate, status" });

  const validStatuses = ["Active", "Completed", "Dropped"];
  if (!validStatuses.includes(status))
    return res.status(400).json({ success: false, message: "Status must be: Active, Completed, or Dropped" });

  const existing = await Enrollment.findOne({ studentId, courseId });
  if (existing)
    return res.status(400).json({ success: false, message: "Student is already enrolled in this course" });

  const enrollment = await Enrollment.create({ studentId, courseId, courseName, enrollmentDate, status });
  res.status(201).json({ success: true, message: "Enrollment created", data: enrollment });
});

// ─── UPDATE ENROLLMENT ────────────────────────────────────────────────────────
/**
 * @swagger
 * /enrollments/{id}:
 *   put:
 *     summary: Update an existing enrollment
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Enrollment'
 *     responses:
 *       200:
 *         description: Enrollment updated successfully
 *       404:
 *         description: Enrollment not found
 */
router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ success: false, message: "Invalid enrollment ID" });
  const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!enrollment) return res.status(404).json({ success: false, message: "Enrollment not found" });
  res.json({ success: true, message: "Enrollment updated", data: enrollment });
});

// ─── DELETE ENROLLMENT ────────────────────────────────────────────────────────
/**
 * @swagger
 * /enrollments/{id}:
 *   delete:
 *     summary: Delete an enrollment by ID
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment deleted successfully
 *       404:
 *         description: Enrollment not found
 */
router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ success: false, message: "Invalid enrollment ID" });
  const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
  if (!enrollment) return res.status(404).json({ success: false, message: "Enrollment not found" });
  res.json({ success: true, message: "Enrollment deleted", data: enrollment });
});

module.exports = router;
