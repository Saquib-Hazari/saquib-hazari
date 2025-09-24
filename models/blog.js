// Creating the blog.js model
const mongoose = require("mongoose");
const Joi = require("joi");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 50,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
    tools: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: [],
    },
    website: {
      type: String,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

function validBlogs(blog) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required().trim(),
    subtitle: Joi.string().min(5).max(255).trim().required(),
    description: Joi.string().required(),
    tools: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.string())
    ),
    languages: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.string())
    ),
    website: Joi.string().uri().allow(""),
  });
  return schema.validate(blog);
}

module.exports = { Blog, validBlogs };
