const agile = require('../controllers/agile.controller');
const asyncHandler = require('express-async-handler')
const { authJwt } = require("../middlewares");

module.exports = function(app) {
    // app.get('/api/agile/test',[authJwt.verifyToken] , asyncHandler(agile.test));
    app.get('/api/agile/:entity/:id',[authJwt.verifyToken], asyncHandler(agile.get));  
    app.get('/api/agile/:entity',[authJwt.verifyToken], asyncHandler(agile.query));  
    
};

