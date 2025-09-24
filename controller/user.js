// Creating the user Controller functions
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users, validateUser, validateLogin } = require("../models/user");

async function signupUserHandler(req, res) {
  const { name, email, password } = req.body;
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Hashing the password
  const salt = await bcrypt.genSalt(16);
  const hashedPassword = await bcrypt.hash(password, salt);

  await Users.create({
    name: name,
    email: email,
    password: hashedPassword,
  });

  return res.redirect("/api/user/login");
}

async function loginUserHandler(req, res) {
  const { email, password } = req.body;
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await Users.findOne({ email: email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validUser = await bcrypt.compare(password, user.password);
  if (!validUser) return res.status(400).send("Invalid email or password");

  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };

  // Creating the token
  const token = jwt.sign(payload, process.env.jwtPrivateKey);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.cookie("flashMessage", "✅ Login Successful!", { maxAge: 5000 });

  return res.redirect("/");
}

module.exports = { signupUserHandler, loginUserHandler };
