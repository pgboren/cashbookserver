const db = require('../models');

const User = db.user;
const { authJwt } = require("../middlewares");
const controller = require("../controllers/role.controller");

module.exports = function(app) {

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/roles", [authJwt.verifyToken, authJwt.isAdmin], controller.all);

};