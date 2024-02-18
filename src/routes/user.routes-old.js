const { authJwt } = require("../middlewares");
const UserController = require("../controllers/userController");
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
  const userController = new UserController();
  app.get("/api/users/check-email-exists", [authJwt.verifyToken, authJwt.isAdmin], userController.checkemailexist);
  app.get("/api/users", [authJwt.verifyToken, authJwt.isAdmin], userController.all);
  app.get("/api/users/:id", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(userController.get));
  app.put("/api/users/:id", [imageUpload.single('file'), authJwt.verifyToken, authJwt.isAdmin], asyncHandler(userController.update));
  app.post("/api/users", [imageUpload.single('file'), authJwt.verifyToken, authJwt.isAdmin], asyncHandler(userController.post));
  app.delete("/api/users/:id", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(userController.markAsDeleted));
};