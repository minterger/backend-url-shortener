const { Router } = require("express");
const { getUrl, postUrl } = require("../controllers/url.controllers");
const { isAuth } = require("../middlewares/auth");

const route = Router();

route.get("/", isAuth, getUrl);

route.post("/", isAuth, postUrl);

module.exports = route;
