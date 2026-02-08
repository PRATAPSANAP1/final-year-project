const multer = require('multer');
const pdfParse = require('pdf-parse');

const upload = multer({ storage: multer.memoryStorage() });

function calculateATSScore(resumeText) {
    const text = resumeText.toLowerCase();
    const words = text.split(/\W+/).filter(w => w.length > 2);
    const uniqueWords = new Set(words);
    
    let score = 0;
    
    // Technical skills (40 points)
    const technicalSkills = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'mongodb', 'html', 'css', 'git', 'api', 'aws', 'docker', 'typescript', 'angular', 'vue', 'express', 'django', 'flask', 'spring', 'kubernetes', 'jenkins', 'agile', 'scrum', 'rest', 'graphql', 'redux', 'webpack', 'babel', 'npm', 'yarn', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'kafka', 'rabbitmq', 'microservices', 'devops', 'linux', 'bash', 'shell', 'terraform', 'ansible', 'prometheus', 'grafana'];
    const foundSkills = technicalSkills.filter(skill => text.includes(skill));
    score += Math.min(40, foundSkills.length * 2);
    
    // Education keywords (15 points)
    const educationKeywords = ['bachelor', 'master', 'degree', 'university', 'college', 'graduate', 'phd', 'diploma', 'certification', 'certified', 'btech', 'mtech', 'bca', 'mca', 'bsc', 'msc'];
    const foundEducation = educationKeywords.filter(kw => text.includes(kw));
    score += Math.min(15, foundEducation.length * 3);
    
    // Experience keywords (20 points)
    const experienceKeywords = ['experience', 'worked', 'developed', 'built', 'created', 'designed', 'implemented', 'managed', 'led', 'project', 'team', 'years', 'months', 'intern', 'internship', 'job', 'role', 'position', 'responsibilities'];
    const foundExperience = experienceKeywords.filter(kw => text.includes(kw));
    score += Math.min(20, foundExperience.length * 2);
    
    // Contact info (10 points)
    const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/.test(text);
    const hasPhone = /\d{10}|\+\d{1,3}[\s-]?\d{10}/.test(text);
    if (hasEmail) score += 5;
    if (hasPhone) score += 5;
    
    // Content richness (15 points)
    if (uniqueWords.size > 100) score += 5;
    if (uniqueWords.size > 200) score += 5;
    if (uniqueWords.size > 300) score += 5;
    
    return Math.min(100, score);
}

function extractMissingKeywords(resumeText) {
    const text = resumeText.toLowerCase();
    const commonKeywords = ['javascript', 'python', 'react', 'node.js', 'sql', 'git', 'html', 'css', 'api', 'agile', 'docker', 'aws', 'typescript', 'mongodb', 'express.js'];
    const missing = commonKeywords.filter(kw => !text.includes(kw.toLowerCase().replace(/[.\s]/g, '')));
    return missing.slice(0, 8);
}

async function checkPDFResume(req, res) {
    try {
        if (!req.file) {
            return res.json({ success: false, error: 'No PDF file uploaded' });
        }

        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text;

        const atsScore = calculateATSScore(resumeText);
        const missingKeywords = extractMissingKeywords(resumeText);

        res.json({ success: true, atsScore, missingKeywords });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
}

module.exports = { upload, checkPDFResume };
