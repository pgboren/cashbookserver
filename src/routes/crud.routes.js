const crud = require('../controllers/crud.controller');
const asyncHandler = require('express-async-handler')
const { authJwt } = require("../middlewares");

module.exports = function(app) {
    app.post('/api/crud/:entity' , asyncHandler(crud.createDoc));
    app.get('/api/crud/:entity/:id' , asyncHandler(crud.getDoc));
    app.route('/api/crud/:entity/:id').patch(crud.patch);
    app.route('/api/crud/:entity/:id').delete(crud.delete)
};

// [authJwt.verifyToken]