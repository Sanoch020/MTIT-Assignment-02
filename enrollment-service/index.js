require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const enrollmentRoutes = require("./routes/enrollments");

const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));
const PORT = 3004;

app.use(cors());
app.use(express.json());

app.set("json spaces", 2);

// ─── Swagger Setup ────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Enrollment Service API",
      version: "1.0.0",
      description:
        "Microservice for managing enrollments in the School Management System",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Direct access",
      },
      {
        url: "http://localhost:8080/enrollments",
        description: "Via API Gateway",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/enrollments", enrollmentRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ service: "Enrollment Service", status: "UP", port: PORT });
});

app.listen(PORT, () => {
  console.log(`✅ Enrollment Service running on http://localhost:${PORT}`);
  console.log(`📄 Swagger Docs: http://localhost:${PORT}/api-docs`);
});
