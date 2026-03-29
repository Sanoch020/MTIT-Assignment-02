/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║              API GATEWAY — School Management System                     ║
 * ║  Single entry point on port 8080 that routes all requests               ║
 * ║  to the appropriate microservice, eliminating the need for              ║
 * ║  clients to know individual service ports.                              ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 *  Routing Table:
 *  ┌─────────────────────────────────────┬───────────────────────────────┐
 *  │  Gateway URL (port 8080)            │  Forwards To                  │
 *  ├─────────────────────────────────────┼───────────────────────────────┤
 *  │  /students/**                       │  http://localhost:3001        │
 *  │  /courses/**                        │  http://localhost:3002        │
 *  │  /teachers/**                       │  http://localhost:3003        │
 *  │  /enrollments/**                    │  http://localhost:3004        │
 *  │  /docs/students                     │  Swagger UI — Student Svc     │
 *  │  /docs/courses                      │  Swagger UI — Course Svc      │
 *  │  /docs/teachers                     │  Swagger UI — Teacher Svc     │
 *  │  /docs/enrollments                  │  Swagger UI — Enrollment Svc  │
 *  └─────────────────────────────────────┴───────────────────────────────┘
 */

const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// ─── Service Registry ─────────────────────────────────────────────────────────
const SERVICE_REGISTRY = {
  students:   "http://localhost:3001",
  courses:    "http://localhost:3002",
  teachers:   "http://localhost:3003",
  enrollments:"http://localhost:3004",
};

// ─── Logging Middleware ───────────────────────────────────────────────────────
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] GATEWAY → ${req.method} ${req.path}`);
  next();
});

// ─── Gateway Home / Health ────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    name: "School Management System — API Gateway",
    version: "1.0.0",
    port: PORT,
    services: Object.entries(SERVICE_REGISTRY).map(([name, url]) => ({
      service: name,
      gateway_url: `http://localhost:${PORT}/${name}`,
      direct_url: url,
      swagger_via_gateway: `http://localhost:${PORT}/docs/${name}`,
    })),
  });
});

app.get("/health", (req, res) => {
  res.json({
    gateway: "UP",
    services: Object.entries(SERVICE_REGISTRY).map(([name, url]) => ({
      name,
      target: url,
    })),
  });
});

// ─── Proxy: Swagger Docs (via gateway) ───────────────────────────────────────
// Access any service's swagger through: http://localhost:8080/docs/<service>
app.use(
  "/docs/students",
  createProxyMiddleware({ target: SERVICE_REGISTRY.students, changeOrigin: true, pathRewrite: { "^/docs/students": "/api-docs" } })
);
app.use(
  "/docs/courses",
  createProxyMiddleware({ target: SERVICE_REGISTRY.courses, changeOrigin: true, pathRewrite: { "^/docs/courses": "/api-docs" } })
);
app.use(
  "/docs/teachers",
  createProxyMiddleware({ target: SERVICE_REGISTRY.teachers, changeOrigin: true, pathRewrite: { "^/docs/teachers": "/api-docs" } })
);
app.use(
  "/docs/enrollments",
  createProxyMiddleware({ target: SERVICE_REGISTRY.enrollments, changeOrigin: true, pathRewrite: { "^/docs/enrollments": "/api-docs" } })
);

// ─── Proxy: API Routes ────────────────────────────────────────────────────────
// All /students/* requests → Student Service on port 3001
app.use(
  "/students",
  createProxyMiddleware({
    target: SERVICE_REGISTRY.students,
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        res.status(503).json({ success: false, message: "Student Service unavailable", error: err.message });
      },
    },
  })
);

// All /courses/* requests → Course Service on port 3002
app.use(
  "/courses",
  createProxyMiddleware({
    target: SERVICE_REGISTRY.courses,
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        res.status(503).json({ success: false, message: "Course Service unavailable", error: err.message });
      },
    },
  })
);

// All /teachers/* requests → Teacher Service on port 3003
app.use(
  "/teachers",
  createProxyMiddleware({
    target: SERVICE_REGISTRY.teachers,
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        res.status(503).json({ success: false, message: "Teacher Service unavailable", error: err.message });
      },
    },
  })
);

// All /enrollments/* requests → Enrollment Service on port 3004
app.use(
  "/enrollments",
  createProxyMiddleware({
    target: SERVICE_REGISTRY.enrollments,
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        res.status(503).json({ success: false, message: "Enrollment Service unavailable", error: err.message });
      },
    },
  })
);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.path} not found on gateway`,
    available_routes: ["/students", "/courses", "/teachers", "/enrollments"],
  });
});

// ─── Start Gateway ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("\n╔════════════════════════════════════════════╗");
  console.log(`║   🚀 API GATEWAY started on port ${PORT}     ║`);
  console.log("╠════════════════════════════════════════════╣");
  console.log("║  Route         → Service           Port   ║");
  console.log("║  /students     → Student Service   :3001  ║");
  console.log("║  /courses      → Course Service    :3002  ║");
  console.log("║  /teachers     → Teacher Service   :3003  ║");
  console.log("║  /enrollments  → Enroll. Service   :3004  ║");
  console.log("╠════════════════════════════════════════════╣");
  console.log("║  Swagger Docs via Gateway:                 ║");
  console.log("║  /docs/students                            ║");
  console.log("║  /docs/courses                             ║");
  console.log("║  /docs/teachers                            ║");
  console.log("║  /docs/enrollments                         ║");
  console.log("╚════════════════════════════════════════════╝\n");
});
