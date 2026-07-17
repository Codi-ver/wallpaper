const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req,file, cb) {
        const uniqueSuffix = Date.now + '-' + Math.round(Math.random() * 1E9);
        console.log(uniqueSuffix);
        const ext = path.extname(file.originalname);
        console.log(ext);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
        console.log('✅ MIME type accepted!');
        cb(null, true);
    } else {
        console.log('❌ MIME type rejected!');
        cb(new Error('The file format is not allowed!'), false);
    }
};


const limits = {
    fileSize: 10 * 1024 * 1024 // ۱۰ مگابایت
};

const uploadWallpaper = multer({
    storage,
    fileFilter,
    limits
});

module.exports = uploadWallpaper;