const cloudinary = require('cloudinary').v2;
const { allow } = require('joi');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderLust_Dev',
    // ✅ Only allow these formats
    allowed_formats: ["jpeg", "png", "jpg", "webp", "avif"],

    // ✅ Auto optimize images
    transformation: [{ quality: "auto", fetch_format: "auto" }],    
  },
});

module.exports = { cloudinary, storage };