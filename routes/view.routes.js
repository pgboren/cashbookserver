const view = require('../controllers/view.controller');
const asyncHandler = require('express-async-handler')
const { authJwt } = require("../middlewares");

module.exports = function(app) {
    app.get('/api/view/:entity',[authJwt.verifyToken] , asyncHandler(view.query));
    app.get('/api/view/:entity/:id', asyncHandler(view.get));  
    app.get('/api/coponcode', asyncHandler(view.getConponCode));  
};

