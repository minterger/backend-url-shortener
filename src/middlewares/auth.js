const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "Access denied",
    });
  }

  try {
    const { id } = jwt.verify(token, process.env.SECRET_KEY);

    req.userId = id;

    next();
  } catch (error) {
    res.status(401).json({
      ok: false,
      msg: "Session expired",
    });
  }
};

module.exports = {
  isAuth,
};
