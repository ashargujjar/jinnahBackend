const multer = require("multer");
const multerS3 = require("multer-s3");
const s3Client = require("../config/aws");

const upload = multer({
  storage: multerS3({
    s3: s3Client, // ✅ use s3 here
    bucket: process.env.AWS_BUCKET_NAME,
    key: function (req, file, cb) {
      const uniqueName = Date.now().toString() + "-" + file.originalname;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // optional: 5MB
});

module.exports = upload;

// // Storage setup
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // make sure this folder exists
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// // File filter (optional)
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// // Multer instance
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// });

module.exports = upload;
