const view = require('../controllers/view.controller');
const asyncHandler = require('express-async-handler')
const { authJwt } = require("../middlewares");

module.exports = function(app) {
    app.post('/api/view/:viewName/:docname',[authJwt.verifyToken] , asyncHandler(view.getViewData));
    app.get('/api/view/pdfInvoice/:id',asyncHandler(view.generateInvoice));
    app.get('/api/view/fbqr',asyncHandler(view.fbqr));
};

