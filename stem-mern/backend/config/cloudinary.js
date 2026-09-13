const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Deletes a file previously uploaded via uploadKitFiles/uploadBrandingFiles.
// `url` is the full secure_url we stored in MongoDB (e.g. kit.kit_image).
const deleteFromCloudinary = async (url) => {
  if (!url || !url.includes('res.cloudinary.com')) return;
  try {
    const resourceType = url.includes('/raw/upload/') ? 'raw' : 'image';
    // Everything between "/upload/v<digits>/" and the final file extension is the public_id.
    const match = url.match(/\/upload\/v\d+\/(.+)\.[a-zA-Z0-9]+$/);
    if (!match) return;
    const publicId = match[1];
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Cloudinary delete failed:', err.message);
  }
};

module.exports = cloudinary;
module.exports.deleteFromCloudinary = deleteFromCloudinary;
