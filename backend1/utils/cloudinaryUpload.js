const streamifier = require('streamifier');
const path = require('path');
const cloudinary = require('../config/cloudinary');

// Uploads a buffer (from multer memoryStorage) to Cloudinary.
// For "raw" resource types (PDFs, Word docs — anything that isn't an image),
// Cloudinary does NOT keep the original file extension unless you pass it
// explicitly via `format`. Without it, the delivered URL has no extension
// (e.g. .../resumes/abc123 instead of .../resumes/abc123.pdf), which is why
// browsers/PDF viewers can fail to recognize the file. We derive the
// extension from the original filename multer captured and pass it through.
const uploadBufferToCloudinary = (buffer, folder, resourceType = 'image', originalFilename) => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: `venus/${folder}`,
      resource_type: resourceType,
    };

    if (resourceType === 'raw' && originalFilename) {
      const ext = path.extname(originalFilename).replace('.', '').toLowerCase();
      if (ext && ext.length <= 5) {
        options.format = ext;
      }
    }

    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Cloudinary delete failed:', err.message);
  }
};

module.exports = { uploadBufferToCloudinary, deleteFromCloudinary };