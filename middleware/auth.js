// Creating authenticate token
const jwt = require("jsonwebtoken");
const logger = require("../services/logger");

function authMiddleware(req, res, next) {
  const token = req.cookies ? req.cookies.token : null;

  res.locals.authenticatedToken = !!token;
  res.locals.authToken = token || null;
  res.locals.user = null;
  req.user = null;

  if (!token) return next();

  try {
    const decode = jwt.verify(token, process.env.jwtPrivateKey);
    req.user = decode;
    res.locals.user = decode;
    res.locals.authenticatedToken = true;
  } catch (err) {
    res.locals.authenticatedToken = false;
    res.locals.authToken = null;
    res.locals.user = null;
    req.user = null;
  }
  next();
}

module.exports = authMiddleware;
