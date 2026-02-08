require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const route = require("./Routes/userRoutes");
const bertRoute = require("./Routes/routes");
const getData = require("./Routes/getData");
const applicationRoutes = require("./Routes/applicationRoutes");
const quizRoutes = require("./Routes/quizRoutes");
const notificationRoutes = require("./Routes/notificationRoutes");
const atsRoutes = require("./Routes/atsRoutes");
const fraudRoutes = require("./Routes/fraudRoutes");
const pdf = require("./2");

const app = express();
const sec = process.env.secret_key;

/* ---------------- MIDDLEWARE ---------------- */

// 🔥 CORS (VERY IMPORTANT)
app.use(cors({
    origin: process.env.FRONTEND_URL, // e.g. https://your-frontend.vercel.app
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------------- AUTH MIDDLEWARE ---------------- */

function validateUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, sec, (err, user) => {
        if (err) {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
}

function validateAdmin(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, sec, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        if (user.email !== process.env.GOV_EMAIL) {
            return res.status(403).json({ message: "Access Forbidden" });
        }

        req.user = user;
        next();
    });
}

/* ---------------- AUTH CHECK APIs ---------------- */

// Frontend will call this
app.get("/api/validate-user", validateUser, (req, res) => {
    res.json({ success: true, user: req.user });
});

app.get("/api/validate-admin", validateAdmin, (req, res) => {
    res.json({ success: true, admin: true });
});

/* ---------------- API ROUTES ---------------- */

app.use("/api/parse-resume", pdf);
app.use("/api", route);
app.use("/bert", bertRoute);
app.use("/getData", getData);
app.use("/application", applicationRoutes);
app.use("/quiz", quizRoutes);
app.use("/notification", notificationRoutes);
app.use("/ats", atsRoutes);
app.use("/api/fraud", fraudRoutes);

/* ---------------- SERVER ---------------- */

app.listen(3400, () => {
    console.log("Backend running on port 3400 🚀");
});
