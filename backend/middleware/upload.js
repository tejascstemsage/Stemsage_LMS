const multer = require('multer');
const path = require('path');
const fs = require('fs');

const makeStorage = (folder) => {
  const dest = path.join(__dirname, '..', 'uploads', folder);
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const unique = Date.now() + '_' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${unique}${ext}`);
    }
  });
};

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
  if (ok) return cb(null, true);
  cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
};

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') return cb(null, true);
  cb(new Error('Only PDF files are allowed'));
};

// For kits: kit_image (image) + manual_pdf (pdf)
const uploadKitFiles = multer({
  storage: makeStorage('kits'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'kit_image') return imageFilter(req, file, cb);
    if (file.fieldname === 'manual_pdf') return pdfFilter(req, file, cb);
    cb(new Error('Unexpected field'));
  }
}).fields([
  { name: 'kit_image', maxCount: 1 },
  { name: 'manual_pdf', maxCount: 1 }
]);

// For branding: logo_image + bg_image
const uploadBrandingFiles = multer({
  storage: makeStorage('branding'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter
}).fields([
  { name: 'logo_image', maxCount: 1 },
  { name: 'bg_image', maxCount: 1 }
]);

module.exports = { uploadKitFiles, uploadBrandingFiles };
