// blog.js controller
const { Blog, validBlogs } = require("../models/blog");
const logger = require("../services/logger");
const MarkdownIt = require("markdown-it");
const hljs = require("highlight.js");
const mongoose = require("mongoose");

// Configure MarkdownIt with syntax highlighting
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(str, { language: lang }).value
        }</code></pre>`;
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

async function createBlogHandler(req, res) {
  try {
    const { title, subtitle, description, tools, languages, website } =
      req.body;
    const { error } = validBlogs(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const blog = new Blog({
      title,
      subtitle,
      description,
      user: req.user._id,
      tools: req.body.tools
        ? Array.isArray(req.body.tools)
          ? req.body.tools
          : [req.body.tools]
        : [],
      languages: req.body.languages
        ? Array.isArray(req.body.languages)
          ? req.body.languages
          : [req.body.languages]
        : [],
      website: req.body.website || null,
    });

    await blog.save();
    return res.redirect("/api/blog/" + blog._id);
  } catch (err) {
    logger.error("Error Something went wrong.", err);
  }
}

async function getBlogHandler(req, res) {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!blog)
      return res.status(404).render("404", { title: "blog not found" });

    const relatedBlogs = await Blog.find({ _id: { $ne: blog._id } })
      .limit(3)
      .populate("user", "name email");

    // Convert Markdown → HTML with markdown-it
    const titleHtml = md.render(blog.title);
    const subtitleHtml = md.render(blog.subtitle);
    const descriptionHtml = md.render(blog.description);

    return res.render("blog", {
      blog,
      relatedBlogs,
      titleHtml,
      subtitleHtml,
      descriptionHtml,
      flashMessage: req.cookies.flashMessage || null,
    });
  } catch (err) {
    logger.error("Error fetching blog", err);
    res.status(500).send("Server Error fetching blog");
  }
}

module.exports = { createBlogHandler, getBlogHandler };
