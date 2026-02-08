const fs = require("fs");
const pdf = require("pdf-parse");
const path = require("path");
let filePath = path.join(__dirname, "uploads", "resumes", "1758790347346-Resume.pdf");
let dataBuffer = fs.readFileSync(filePath);
pdf(dataBuffer).then(function (data) {
  const text = data.text;
  const emailMatch = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
  const email = emailMatch ? emailMatch[0] : "Not found";
  const phoneMatch = text.match(/(\+?\d{1,4}[\s-])?(?:\d{10}|\d{3}[\s-]\d{3}[\s-]\d{4})/);
  const phone = phoneMatch ? phoneMatch[0] : "Not found";
  const nameMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+){0,2})/);
  const name = nameMatch ? nameMatch[0] : "Not found";
  const skillKeywords = [
    "JavaScript", "Node.js", "React", "Express", "MongoDB", "HTML", "CSS",
    "Python", "C", "C++", "Java", "Git", "SQL", "Docker", "Kubernetes"
  ];
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  const skillsFound = skillKeywords.filter(skill => {
    const escapedSkill = escapeRegex(skill);
    return new RegExp(`\\b${escapedSkill}\\b`, "i").test(text);
  });
  console.log("===== Resume Parsed Data =====");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Phone:", phone);
  console.log("Skills:", skillsFound.join(", ") || "Not found");
});