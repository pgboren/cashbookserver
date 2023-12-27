const media = require('../controllers/media.controller');
const asyncHandler = require('express-async-handler')
const { authJwt } = require("../middlewares");
const multer  = require('multer');
const path = require('path');
const fileHelper = require('./../helper/fileHelper');

const imageStorage = multer.diskStorage({
    destination: 'public/uploads/', 
      filename: (req, file, cb) => {
          cb(null, path.parse(file.originalname).name + '_' + Date.now() 
            + path.extname(file.originalname));
    }
});

const imageUpload = multer({
	storage: imageStorage,
	limits: {
	  fileSize: 1000000
	}
}) 

module.exports = function(app) {
    app.post('/api/media/upload',[imageUpload.single('file'), authJwt.verifyToken] , asyncHandler(media.upload));
};