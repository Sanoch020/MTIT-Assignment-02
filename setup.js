const { execSync } = require("child_process");
const path = require("path");

const services = ["student-service", "course-service", "teacher-service", "enrollment-service", "api-gateway"];

services.forEach((svc) => {
  console.log(`\n📦 Installing ${svc}...`);
  execSync("npm install", { cwd: path.join(__dirname, svc), stdio: "inherit" });
});

console.log("\n📦 Installing root (concurrently)...");
execSync("npm install", { cwd: __dirname, stdio: "inherit" });

console.log("\n✅ All done! Now run: npm start\n");