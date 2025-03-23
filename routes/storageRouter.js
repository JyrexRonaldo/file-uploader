const { Router } = require("express");
const storageRouter = Router();
const storageController = require("../controllers/storageController");
const authController = require("../controllers/authController")

storageRouter.route("/").get(authController.isAuth ,storageController.getStorageItems);

storageRouter.route("/download").get(storageController.downloadItem);

storageRouter
  .route("/folder")
  .get(storageController.getFolderForm)
  .post(storageController.addFolder);

storageRouter
  .route("/file")
  .get(storageController.getFileForm)
  .post(storageController.multerUpload, storageController.addFile);

module.exports = storageRouter;
