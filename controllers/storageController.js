const prisma = require("../config/prisma");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});

// const upload = multer({ dest: "./uploads" });

const upload = multer({ storage });

const multerUpload = upload.single("uploaded_file");

function getFileForm(req, res) {
  res.render("forms/upload-file-form");
}

function getFolderForm(req, res) {
  res.render("forms/upload-folder-form");
}

function addFile(req, res) {
  console.log(req.file, req.body);
  res.redirect("/storage/file");
}

function addFolder(req, res) {
  prisma.folder
  res.redirect("/storage/folder");
}



function getStorageItems(req, res) {
  res.render("pages/home-page");
}

module.exports = {
  multerUpload,
  addFile,
  getFileForm,
  getFolderForm,
  getStorageItems,
};
