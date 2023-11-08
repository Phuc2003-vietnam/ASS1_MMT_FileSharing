const multer = require("multer-utf8");
const path = require("path");

const storageWork = multer.diskStorage({
  destination: (req, file, cb) => {
    savePath = path.join(__dirname, "../repo");
    cb(null, savePath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadRepo = multer({
  storage: storageWork,
  charset: "utf8",
});
module.exports = uploadRepo;
