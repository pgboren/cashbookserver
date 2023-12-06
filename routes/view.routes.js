const view = require('../controllers/view.controller');
const asyncHandler = require('express-async-handler')
const { authJwt } = require("../middlewares");

module.exports = function(app) {
    app.get('/api/document/:docname', asyncHandler(view.getDocumentClass));
    app.post('/api/view/lookup/:docname', [authJwt.verifyToken], asyncHandler(view.lookup));
    app.post('/api/view/:viewName/:docname', asyncHandler(view.getViewData));
    app.get('/api/view/pdfInvoice/:id',asyncHandler(view.generateInvoice));
    app.get('/api/view/vehiclelable/:id',asyncHandler(view.generateVehicleLable));
    app.get('/api/view/nextcounter/:id',asyncHandler(view.nextcounter));
    app.get('/api/view/nextcounter/:id',asyncHandler(view.nextcounter));
    app.get('/api/view/tutorials',asyncHandler(view.tutorialList));
};


