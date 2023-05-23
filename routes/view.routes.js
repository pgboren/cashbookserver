const view = require('../controllers/view.controller');
const asyncHandler = require('express-async-handler')
const { authJwt } = require("../middlewares");

module.exports = function(app) {
    app.post('/api/view/:viewName/:docname',[authJwt.verifyToken] , asyncHandler(view.getViewData));

    app.get('/api/view/:document/:id',[authJwt.verifyToken] , asyncHandler(view.get));
    app.get('/api/view/:entity',[authJwt.verifyToken] , asyncHandler(view.query));
    app.get('/api/view/:entity',[authJwt.verifyToken] , asyncHandler(view.query));
    app.get('/api/newcouponnumber/:entity', asyncHandler(view.getNewCouponNumber));  
};

