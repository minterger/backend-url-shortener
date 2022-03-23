const { Router } = require("express");
const {
  getUrl,
  postUrl,
  goUrl,
  deleteUrl,
} = require("../controllers/url.controllers");
const { isAuth } = require("../middlewares/auth");

const route = Router();

route.get("/:id", isAuth, getUrl);

route.get("/go/:id", goUrl);

route.post("/", isAuth, postUrl);

route.delete("/:id", isAuth, deleteUrl);

module.exports = route;
