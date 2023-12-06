const gazetteer = require('../controllers/gazetteer.controller');
const asyncHandler = require('express-async-handler')
const { authJwt } = require("../middlewares");

module.exports = function(app) {
    app.get('/api/gazetteer/provinces', asyncHandler(gazetteer.listProvinces));
    app.get('/api/gazetteer/districts/:province', asyncHandler(gazetteer.listDistricts));
    app.get('/api/gazetteer/communes/:district', asyncHandler(gazetteer.listCommunes));
    app.get('/api/gazetteer/villages/:commune', asyncHandler(gazetteer.listVillages));
};