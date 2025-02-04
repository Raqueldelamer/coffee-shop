const multer = require("multer");
const path = require("path");


// Define storage settings (e.g., store files locally in the 'uploads' folder)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Save file with a unique name
    }
});

const upload = multer({ storage });

module.exports = upload;