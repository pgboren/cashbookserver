const agile = require('../controllers/agile.controller');
const asyncHandler = require('express-async-handler')
const { authJwt } = require("../middlewares");

module.exports = function(app) {
    app.get('/api/agile/:tasks/:id',[authJwt.verifyToken], asyncHandler(agile.get));  
    app.get('/api/agile/tasks',[authJwt.verifyToken], asyncHandler(agile.getTasks));  
};