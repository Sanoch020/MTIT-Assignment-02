const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Course = require("../models/courseModel");

// ─── Swagger Schema Definition ────────────────────────────────────────────────
/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - credits
 *         - duration
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated course ID
 *           example: 1
 *         title:
 *           type: string
 *           description: Title of the course
 *           example: Mathematics
 *         description:
 *           type: string
 *           description: Brief description of the course content
 *           example: Advanced algebra and calculus
 *         credits:
 *           type: integer
 *           description: Credit hours for the course
 *           example: 4
 *         duration:
 *           type: string
 *           description: Duration of the course
 *           example: 6 months
 */

// ─── GET ALL COURSES ──────────────────────────────────────────────────────────
/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Retrieve all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
 */
router.get("/", async (req, res) => {
  const courses = await Course.find();
  res.json({ success: true, count: courses.length, data: courses });
});

// ─── GET COURSE BY ID ─────────────────────────────────────────────────────────
/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course found
 *       404:
 *         description: Course not found
 */
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ success: false, message: "Invalid course ID" });
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ success: false, message: "Course not found" });
  res.json({ success: true, data: course });
});

// ─── CREATE COURSE ────────────────────────────────────────────────────────────
/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Missing required fields
 */
router.post("/", async (req, res) => {
  const { title, description, credits, duration } = req.body;
  if (!title || !description || !credits || !duration)
    return res.status(400).json({ success: false, message: "All fields required: title, description, credits, duration" });

  const existing = await Course.findOne({ title });
  if (existing)
    return res.status(400).json({ success: false, message: "Course with this title already exists" });

  const course = await Course.create({ title, description, credits, duration });
  res.status(201).json({ success: true, message: "Course created", data: course });
});

// ─── UPDATE COURSE ────────────────────────────────────────────────────────────
/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update an existing course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 */
router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ success: false, message: "Invalid course ID" });
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!course) return res.status(404).json({ success: false, message: "Course not found" });
  res.json({ success: true, message: "Course updated", data: course });
});

// ─── DELETE COURSE ────────────────────────────────────────────────────────────
/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ success: false, message: "Invalid course ID" });
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ success: false, message: "Course not found" });
  res.json({ success: true, message: "Course deleted", data: course });
});

module.exports = router;
