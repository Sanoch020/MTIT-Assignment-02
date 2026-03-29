require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const studentRoutes = require("./routes/students");

const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

const PORT = 3001;

app.use(cors());
app.use(express.json());
app.set("json spaces", 2);

// ─── Swagger Setup ────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Student Service API",
      version: "1.0.0",
      description:
        "Microservice for managing students in the School Management System",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Direct access",
      },
      {
        url: "http://localhost:8080/students",
        description: "Via API Gateway",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/students", studentRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ service: "Student Service", status: "UP", port: PORT });
});

app.listen(PORT, () => {
  console.log(`✅ Student Service running on http://localhost:${PORT}`);
  console.log(`📄 Swagger Docs: http://localhost:${PORT}/api-docs`);
});
