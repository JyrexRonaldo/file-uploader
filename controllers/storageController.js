const multer = require("multer");
const upload = multer({ dest: "./uploads" });

const multerUpload = upload.single("uploaded_file")

async function getUploadForm(req, res) {
  res.render("forms/upload-form");
}

async function uploadData(req, res) {
  console.log(req.file, req.body)
  res.redirect("/storage")
}

module.exports = {
  getUploadForm,
  multerUpload,
  uploadData,
};
