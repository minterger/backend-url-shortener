const { Router } = require("express");
const {
  register,
  login,
  getUser,
  userToPremium,
  // updateUser,
  // deleteUser,
} = require("../controllers/auth.controller");
const { isAuth } = require("../middlewares/auth");

const route = Router();

route.post("/register", register);

route.post("/login", login);

route.get("/", isAuth, getUser);

route.post("/premium/:email", userToPremium);

module.exports = route;
