const express = require("express");
const multer = require("multer");
const pdf = require("pdf-parse");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const upload = multer({ dest: "uploads/" });
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
router.post("/p", upload.single("resume"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const filePath = path.join(__dirname, req.file.path);
  const dataBuffer = fs.readFileSync(filePath);
  try {
    const data = await pdf(dataBuffer);
    const text = data.text;
     console.log("txt : ",text);
    const emailMatch = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
    const email = emailMatch ? emailMatch[0] : "";
    const phoneMatch = text.match(/(\+?\d{1,4}[\s-])?(?:\d{10}|\d{3}[\s-]\d{3}[\s-]\d{4})/);
    const phone = phoneMatch ? phoneMatch[0] : "";
    const nameMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+){0,2})/);
    const name = nameMatch ? nameMatch[0] : "";
    const skillKeywords = [
      "JavaScript", "Node.js", "React", "Express", "MongoDB", "HTML", "CSS",
      "Python", "C", "C++", "Java", "Git", "SQL", "Docker", "Kubernetes"
    ];
    const skillsFound = skillKeywords.filter(skill => {
      const escapedSkill = escapeRegex(skill);
      return new RegExp(`\\b${escapedSkill}\\b`, "i").test(text);
    });
    res.json({
      name,
      email,
      phone,
      skills: skillsFound
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to parse resume" });
  } finally {
    fs.unlinkSync(filePath);
  }
});
module.exports=router;