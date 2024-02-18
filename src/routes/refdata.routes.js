const refdata = require('../controllers/refdata.controller');
const asyncHandler = require('express-async-handler')
const { authJwt } = require("../middlewares");

module.exports = function(app) {
    app.get('/api/refdata/syncdata' , asyncHandler(refdata.syncdata));
};

// [authJwt.verifyToken]