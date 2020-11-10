const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  //checks the webtoken of the user contained in their header
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("No token provided");

  try {
    //checks if the user's webtoken is a valid token
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}

//takes any function a wraps it in a try catch block and passes control to index.js for error handling
function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
}

module.exports.auth = auth;
module.exports.asyncMiddleware = asyncMiddleware;
