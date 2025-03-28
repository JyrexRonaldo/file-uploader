const { Router } = require("express");
const storageRouter = Router();
const storageController = require("../controllers/storageController");
const authController = require("../controllers/authController");

storageRouter
  .route("/")
  .get(authController.isAuth, storageController.getStorageItems);

storageRouter.route("/download").get(storageController.downloadItem);

storageRouter
  .route("/folder")
  .get(storageController.getFolderForm)
  .post(storageController.addFolder);

storageRouter
  .route("/file")
  .get(storageController.getFileForm)
  .post(storageController.multerUpload, storageController.addFile);

storageRouter.route("/folder/details").get(storageController.getFolderDetails);

storageRouter.route("/file/details").get(storageController.getFileDetails);

storageRouter.route("/file/download").get(storageController.downloadItem)

storageRouter.route("/folder/delete").get(storageController.deleteFolder);

storageRouter.route("/file/delete").get(storageController.deleteFile)

storageRouter.route("/folder/edit").get(storageController.getFolderEditForm).post(storageController.editFolder)

storageRouter.route("/file/edit").get(storageController.getFileEditForm)
.post(storageController.editFile)

module.exports = storageRouter;
