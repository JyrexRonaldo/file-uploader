const { Router } = require("express");
const storageRouter = Router();
const storageController = require("../controllers/storageController");


storageRouter.route("/").get(storageController.getStorageItems)

storageRouter.route("/folder").get(storageController.getFolderForm);
// .post(storageController.multerUpload, storageController.upladData);

storageRouter
  .route("/file")
  .get(storageController.getFileForm)
  .post(storageController.multerUpload, storageController.addFile);

module.exports = storageRouter;
