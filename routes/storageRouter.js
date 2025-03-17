const { Router } = require("express")
const storageRouter = Router()
const storageController = require("../controllers/storageController")


storageRouter
  .route("/")
  .get(storageController.getUploadForm)
  .post(storageController.multerUpload, storageController.uploadData);


module.exports = storageRouter
