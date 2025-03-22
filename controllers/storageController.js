const prisma = require("../config/prisma");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix);
  },
});

// const upload = multer({ dest: "./uploads" });

const upload = multer({ storage });

const multerUpload = upload.single("uploadedFile");

function getFileForm(req, res) {
  res.render("forms/upload-file-form");
}

function getFolderForm(req, res) {
  res.render("forms/upload-folder-form");
}

async function addFile(req, res) {
  if (req.file) {
    await prisma.file.create({
      data: {
        fileName: req.file.filename,
        originalName: req.file.originalname,
      },
    });
  }
  res.redirect("/storage");
}

async function addFolder(req, res) {
  const { folderName } = req.body;
  await prisma.folder.create({ data: { folderName } });
  res.redirect("/storage");
}

async function getItems(currentFolderId) {
  const files = null;
  const folders = null;

  if (currentFolderId) {
    files = await prisma.file.findMany({
      where: {
        folderId: {
          equals: currentFolderId,
        },
      },
    });

    folders = await prisma.folder.findMany({
      where: {
        parentFolderId: {
          equals: currentFolderId,
        },
      },
    });
  } else {
    files = await prisma.file.findMany();
    folders = await prisma.folder.findMany();
  }
  const items = files
    .concat(folders)
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
  return items;
}

async function getStorageItems(req, res) {
  const items = await getItems();
  res.render("pages/home-page", { items });
}

function downloadItem(req, res) {
  res.download("./uploads/1742632033957-936147402", "merc.jpg");
}

module.exports = {
  multerUpload,
  addFile,
  addFolder,
  getFileForm,
  getFolderForm,
  getStorageItems,
  downloadItem,
};
