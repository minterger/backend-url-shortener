const { Router } = require("express");
const {
  register,
  login,
  getUser,
  // updateUser,
  // deleteUser,
} = require("../controllers/auth.controller");
const { isAuth } = require("../middlewares/auth");

const route = Router();

route.post("/register", register);

route.post("/login", login);

route.get("/", isAuth, getUser);

module.exports = route;
