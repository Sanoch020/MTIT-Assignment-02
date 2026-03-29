require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const courseRoutes = require("./routes/courses");

const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));
const PORT = 3002;

app.use(cors());
app.use(express.json());
app.set("json spaces", 2);

// ─── Swagger Setup ────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Course Service API",
      version: "1.0.0",
      description:
        "Microservice for managing courses in the School Management System",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Direct access",
      },
      {
        url: "http://localhost:8080/courses",
        description: "Via API Gateway",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/courses", courseRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ service: "Course Service", status: "UP", port: PORT });
});

app.listen(PORT, () => {
  console.log(`✅ Course Service running on http://localhost:${PORT}`);
  console.log(`📄 Swagger Docs: http://localhost:${PORT}/api-docs`);
});
