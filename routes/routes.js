// Creating the router for the express
const express = require("express");
const router = express.Router();
const { createBlogHandler, getBlogHandler } = require("../controller/blog");
const { signupUserHandler, loginUserHandler } = require("../controller/user");
const { Blog } = require("../models/blog");
const logger = require("../services/logger");
const nodemailer = require("nodemailer");

router.get("/", async (req, res) => {
  const flashMessage = req.cookies.flashMessage || null;
  const showRecent = req.query.recent === "true";

  const sortOrder = showRecent ? -1 : 1;
  const blogs = await Blog.find()
    .sort({ createdAt: sortOrder })
    .limit(8)
    .populate("user", "name email")
    .lean();

  res.render("main", {
    title: "Techtonick",
    flashMessage,
    blogs,
    showRecent,
    user: req.user || null,
  });
});

router.get("/api/user/login", (req, res) => {
  const flashMessage = req.cookies.flashMessage || null;

  return res.render("login", { title: "Login page", flashMessage });
});

router.get("/api/user/signup", (req, res) => {
  const flashMessage = req.cookies.flashMessage || null;

  return res.render("signup", { title: "SignUp page", flashMessage });
});

router.get("/api/add-blog", (req, res) => {
  const flashMessage = req.cookies.flashMessage || null;

  return res.render("add-blog", { title: "Added Blogs", flashMessage });
});

router.get("/api/blog/:id", getBlogHandler);

router.post("/api/user/signup", signupUserHandler);

router.post("/api/user/login", loginUserHandler);

router.post("/api/add-blog", createBlogHandler);
// Logout route
router.get("/api/user/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.redirect("/api/user/login");
});

// Contact form
router.get("/api/contact", (req, res) => {
  return res.render("contact", { title: "Contact Me", flashMessage: null });
});

router.post("/api/contact", async (req, res) => {
  const { email, category, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 587,
      secure: false, // TLS is handled automatically
      auth: {
        user: "resend", // always "resend"
        pass: process.env.RESEND_API_KEY, // your API key
      },
    });

    const mailOptions = {
      from: "onboarding@resend.dev", // OR your verified domain email
      to: process.env.RECEIVER_EMAIL, // your email
      subject: `[${category}] ${subject}`,
      text: `You got a new message from ${email}
      
Category: ${category}
Message: ${message}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.render("contact", { flashMessage: "✅ Message sent successfully!" });
  } catch (err) {
    console.error("Error sending email: ", err);
    res.render("contact", "Something went wrong. Please try again later.");
  }
});

// Services

router.get("/api/services", (req, res) => {
  return res.render("services", { title: "Services" });
});

module.exports = router;
