const jwt = require("jsonwebtoken");
const tokenSecret = process.env.API_SECRET_KEY;

var self = (module.exports = {
  verifyToken: async (req, res, next) => {
    if (!req.headers["authorization"]) {
      return res.status(401).json({
        status: "error",
        message: "Token Invalid",
        code: 401,
      });
    }

    let authorization = req.headers["authorization"].split(" ");
    if (authorization[0] !== "Bearer") {
      return res.status(401).json({
        status: "error",
        message: "Token Invalid",
        code: 401,
      });
    }
    const token = req.headers.authorization
    jwt.verify(token.split(" ")[1], tokenSecret, (err, value) => {
      if(value) {
        req.user = value.data
      } else {
        res.status(401).json({
          status: "error",
          message: "Token Invalid",
          code: 401,
        });
      }
      next()
    });
  },
});
