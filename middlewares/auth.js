const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");
const { LEVELS } = require("../constants/user-role");

exports.auth = (requiredRole) => {
  return (req, res, next) => {
    try {
      let token = req.header("x-api-key");
      if (!token) {
        return res.status(401).json({
          msg: "You need to send token to this endpoint url",
        });
      }
      let decodeToken = jwt.verify(token, config.tokenSecret);
      const userRole = decodeToken.role; // Assuming you have stored the user's role in the request object
      if (LEVELS[userRole] >= requiredRole) {
        req.userId = decodeToken.id;
        req.body.updated_by_id = decodeToken.id;
        req.body.updatedById = decodeToken.id;
        next(); // User has the required role, continue to the next middleware or route handler
      } else {
        res.status(403).json({ clientErrMsg: "Unauthorized" });
      }
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  };
};
