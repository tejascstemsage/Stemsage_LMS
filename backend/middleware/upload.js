const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

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

const kitStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPdf = file.fieldname === 'manual_pdf';
    return {
      folder: 'stemsage/kits',
      resource_type: isPdf ? 'raw' : 'image',
      public_id: `${Date.now()}_${Math.round(Math.random() * 1e9)}`,
      format: isPdf ? 'pdf' : undefined
    };
  }
});

const uploadKitFiles = multer({
  storage: kitStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'kit_image') return imageFilter(req, file, cb);
    if (file.fieldname === 'manual_pdf') return pdfFilter(req, file, cb);
    cb(new Error('Unexpected field'));
  }
}).fields([
  { name: 'kit_image', maxCount: 1 },
  { name: 'manual_pdf', maxCount: 1 }
]);

const brandingStorage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'stemsage/branding',
    resource_type: 'image',
    public_id: `${Date.now()}_${Math.round(Math.random() * 1e9)}`
  })
});

const uploadBrandingFiles = multer({
  storage: brandingStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter
}).fields([
  { name: 'logo_image', maxCount: 1 },
  { name: 'bg_image', maxCount: 1 }
]);

module.exports = { uploadKitFiles, uploadBrandingFiles };
