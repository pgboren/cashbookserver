const defaultdoc = require('../controllers/default.controller');
const asyncHandler = require('express-async-handler')
const { authJwt } = require("../middlewares");

module.exports = function(app) {
    app.post('/api/setup',[authJwt.verifyToken] , asyncHandler(defaultdoc.create));
    app.post('/api/testdata' , asyncHandler(defaultdoc.testdata));
};
