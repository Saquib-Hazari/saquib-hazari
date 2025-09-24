// Creating the login user
const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

function validateUser(users) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required().trim(),
    email: Joi.string().min(5).max(255).required().trim().email(),
    password: Joi.string().min(5).max(1024).required().trim(),
  });
  return schema.validate(users);
}

function validateLogin(users) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email().trim(),
    password: Joi.string().min(5).max(1024).required().trim(),
  });
  return schema.validate(users);
}

module.exports = { Users, validateUser, validateLogin };
