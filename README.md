# 🏫 School Management System — Microservices Architecture
**IT4020 Modern Topics in IT | Assignment 2**

---

## 📁 Project Structure
```
school-microservices/
├── api-gateway/          ← Single entry point (port 8080)
│   ├── index.js
│   └── package.json
├── student-service/      ← Member 1 (port 3001)
│   ├── index.js
│   ├── routes/students.js
│   └── package.json
├── course-service/       ← Member 2 (port 3002)
│   ├── index.js
│   ├── routes/courses.js
│   └── package.json
├── teacher-service/      ← Member 3 (port 3003)
│   ├── index.js
│   ├── routes/teachers.js
│   └── package.json
├── enrollment-service/   ← Member 4 (port 3004)
│   ├── index.js
│   ├── routes/enrollments.js
│   └── package.json
└── README.md
```

---

## 🚀 How to Run (Open 5 terminals)

### Terminal 1 — Student Service
```bash
cd student-service
npm install
npm start
# Running on http://localhost:3001
```

### Terminal 2 — Course Service
```bash
cd course-service
npm install
npm start
# Running on http://localhost:3002
```

### Terminal 3 — Teacher Service
```bash
cd teacher-service
npm install
npm start
# Running on http://localhost:3003
```

### Terminal 4 — Enrollment Service
```bash
cd enrollment-service
npm install
npm start
# Running on http://localhost:3004
```

### Terminal 5 — API Gateway (Start LAST)
```bash
cd api-gateway
npm install
npm start
# Running on http://localhost:8080
```

---

## 📄 Swagger Docs

### Direct Access (native swagger URLs):
| Service | Swagger URL |
|---------|-------------|
| Student Service | http://localhost:3001/api-docs |
| Course Service | http://localhost:3002/api-docs |
| Teacher Service | http://localhost:3003/api-docs |
| Enrollment Service | http://localhost:3004/api-docs |

### Via API Gateway (single port):
| Service | Gateway Swagger URL |
|---------|---------------------|
| Student Service | http://localhost:8080/docs/students |
| Course Service | http://localhost:8080/docs/courses |
| Teacher Service | http://localhost:8080/docs/teachers |
| Enrollment Service | http://localhost:8080/docs/enrollments |

---

## 🔗 API Endpoints

### Direct Access:
```
GET    http://localhost:3001/students
POST   http://localhost:3001/students
GET    http://localhost:3001/students/:id
PUT    http://localhost:3001/students/:id
DELETE http://localhost:3001/students/:id
```
(Same pattern for courses :3002, teachers :3003, enrollments :3004)

### Via API Gateway (port 8080 only):
```
GET    http://localhost:8080/students
POST   http://localhost:8080/students
GET    http://localhost:8080/students/:id
PUT    http://localhost:8080/students/:id
DELETE http://localhost:8080/students/:id

GET    http://localhost:8080/courses
POST   http://localhost:8080/courses
...

GET    http://localhost:8080/teachers
POST   http://localhost:8080/teachers
...

GET    http://localhost:8080/enrollments
POST   http://localhost:8080/enrollments
...
```

---

## 👥 Group Member Contributions
| Member | Service | Port | Responsibility |
|--------|---------|------|----------------|
| Member 1 | Student Service | 3001 | Student CRUD API + Swagger |
| Member 2 | Course Service | 3002 | Course CRUD API + Swagger |
| Member 3 | Teacher Service | 3003 | Teacher CRUD API + Swagger |
| Member 4 | Enrollment Service | 3004 | Enrollment CRUD API + Swagger |
| All | API Gateway | 8080 | Unified routing & proxy |
