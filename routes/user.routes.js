const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const multer  = require('multer');
const asyncHandler = require('express-async-handler')
const path = require('path');

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
  app.get("/api/users/check-email-exists", [authJwt.verifyToken, authJwt.isAdmin], controller.checkemailexist);
  app.get("/api/users", [authJwt.verifyToken, authJwt.isAdmin], controller.all);
  app.get("/api/users/:id", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.get));
  app.put("/api/users/:id", [imageUpload.single('file'), authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.update));
  app.post("/api/users", [imageUpload.single('file'), authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.post));
  app.delete("/api/users/:id", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.markAsDeleted));
};