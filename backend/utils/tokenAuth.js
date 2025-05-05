const { expressjwt: jwt } = require("express-jwt");

const authenticateToken = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  credentialsRequired: true,
});

module.exports = {
  authenticateToken,
};
