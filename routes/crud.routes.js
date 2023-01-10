const crud = require('../controllers/crud.controller');
const asyncHandler = require('express-async-handler')
const { authJwt } = require("../middlewares");

module.exports = function(app) {
    app.route('/api/crud/:entity').post(crud.new);
    app.route('/api/crud/:entity/:id').patch(crud.patch);
    app.route('/api/crud/:entity/:id').put(crud.update);
    app.route('/api/crud/:entity/:id').delete(crud.delete);
};

