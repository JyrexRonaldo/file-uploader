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
  const { folderId } = req.query;
  res.render("forms/upload-file-form", { folderId });
}

function getFolderForm(req, res) {
  const { folderId } = req.query;
  res.render("forms/upload-folder-form", { folderId });
}

async function addFile(req, res) {
  const { folderId } = req.body;
  const parentFolderName = await prisma.folder.findUnique({
    where: {
      id: +folderId,
    },
    select: {
      folderName: true,
    },
  });
  if (req.file) {
    await prisma.file.create({
      data: {
        fileName: req.file.filename,
        originalName: req.file.originalname,
        folderId: +folderId || null,
        userId: req.user.id,
        size: req.file.size,
      },
    });
  }
  const containingFolderName = parentFolderName
    ? parentFolderName.folderName
    : "";
  res.redirect(
    `/storage?folderId=${folderId}&folderName=${containingFolderName}`
  );
}

async function addFolder(req, res) {
  const { folderName, parentFolderId } = req.body;
  const containingFolderId = +parentFolderId || null;
  const parentFolderName = await prisma.folder.findUnique({
    where: {
      id: +parentFolderId,
    },
    select: {
      folderName: true,
    },
  });
  await prisma.folder.create({
    data: {
      folderName,
      parentFolderId: containingFolderId,
      userId: req.user.id,
    },
  });
  const containingFolderName = parentFolderName
    ? parentFolderName.folderName
    : "";
  res.redirect(
    `/storage?folderId=${parentFolderId}&folderName=${containingFolderName}`
  );
}

async function getItems(currentFolderId, userId) {
  let files = null;
  let folders = null;
  if (currentFolderId) {
    files = await prisma.file.findMany({
      where: {
        folderId: currentFolderId,
        userId,
      },
    });
    folders = await prisma.folder.findMany({
      where: {
        parentFolderId: currentFolderId,
        userId,
      },
    });
  } else {
    files = await prisma.file.findMany({
      where: {
        folderId: null,
        userId,
      },
    });
    folders = await prisma.folder.findMany({
      where: {
        parentFolderId: null,
        userId,
      },
    });
  }
  const items = files
    .concat(folders)
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
  return items;
}

async function getStorageItems(req, res) {
  const folderId = req.query.folderId || null;
  const currentFolderName = req.query.folderName || null;
  let parentFolderName = null;
  let containingFolderId = null;
  const items = await getItems(+folderId, req.user.id);
  const parentFolderId = await prisma.folder.findUnique({
    where: {
      id: Number(folderId),
    },
    select: {
      parentFolderId: true,
      folderName: true,
    },
  });
  if (parentFolderId) {
    const folderName = await prisma.folder.findUnique({
      where: {
        id: +parentFolderId.parentFolderId,
      },
    });
    parentFolderName = folderName;
    containingFolderId = parentFolderId.parentFolderId;
  }
  res.render("pages/home-page", {
    items,
    currentFolderName,
    folderId,
    containingFolderId,
    parentFolderName,
  });
}

async function getFileDetails(req, res) {
  const { fileId } = req.query;
  const fileInfo = await prisma.file.findUnique({
    where: {
      id: +fileId,
    },
  });
  res.render("pages/file-details-page", { fileInfo });
}

async function getFolderDetails(req, res) {
  const { folderId } = req.query;
  const folderInfo = await prisma.folder.findUnique({
    where: {
      id: +folderId,
    },
    include: {
      files: true,
    },
  });

  if (folderInfo) {
    const folderSize = folderInfo.files.reduce((total, file) => {
      return total + file.size;
    }, 0);
    folderInfo.folderSize = folderSize;
  }
  res.render("pages/folder-details-page", { folderInfo });
}

async function deleteFolder(req, res) {
  const { folderId, parentFolderId } = req.query;
  await prisma.folder.delete({
    where: {
      id: +folderId,
    },
  });
  const parentFolderName = await prisma.folder.findUnique({
    where: {
      id: +parentFolderId,
    },
    select: {
      folderName: true,
    },
  });
  const containingFolderName = parentFolderName
    ? parentFolderName.folderName
    : "";
  res.redirect(
    `/storage?folderId=${parentFolderId}&folderName=${containingFolderName}`
  );
}

async function getFolderEditForm(req, res) {
  const { folderId } = req.query;
  const folderInfo = await prisma.folder.findUnique({
    where: {
      id: +folderId,
    },
    include: {
      files: true,
    },
  });
  res.render("forms/edit-folder-form", { folderInfo });
}

async function editFolder(req, res) {
  const { folderName, parentFolderId, currentFolderId } = req.body;
  const parentFolderName = await prisma.folder.findUnique({
    where: {
      id: +parentFolderId,
    },
    select: {
      folderName: true,
    },
  });
  await prisma.folder.update({
    where: {
      id: +currentFolderId,
    },
    data: {
      folderName,
    },
  });
  const containingFolderName = parentFolderName
    ? parentFolderName.folderName
    : "";
  res.redirect(
    `/storage?folderId=${parentFolderId}&folderName=${containingFolderName}`
  );
}

function downloadItem(req, res) {
  const {fileName, originalName} = req.query
  res.download(`./uploads/${fileName}`, `${originalName}`);
}

module.exports = {
  multerUpload,
  addFile,
  addFolder,
  getFileForm,
  getFolderForm,
  getStorageItems,
  downloadItem,
  getFileDetails,
  getFolderDetails,
  deleteFolder,
  getFolderEditForm,
  editFolder,
};
