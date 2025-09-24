// Creating the flashmessage middleware
function flashMessageMiddleware(req, res, next) {
  const flashMessage = req.cookies.flashMessage || null;

  res.locals.flashMessage = flashMessage;
  if (flashMessage) {
    res.clearCookie("flashMessage");
  }
  next();
}

module.exports = flashMessageMiddleware;
