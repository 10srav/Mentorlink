/* eslint-env node */
/* eslint-disable no-undef */
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Configure Cloudinary directly (will use env vars)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to convert buffer to stream for cloudinary.uploader.upload_stream
const bufferToStream = (buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    }
  });
  return readable;
};

// Configure multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }

    // Extract extension and check against allowed list
    const extension = file.originalname.split('.').pop().toLowerCase();
    const allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!allowed.includes(extension)) {
      return cb(new Error(`Only ${allowed.join(', ')} files are allowed`), false);
    }

    cb(null, true);
  }
});

// Middleware to upload to Cloudinary after multer stores in memory
const uploadToCloudinary = async (req, res, next) => {
  try {
    // If no file uploaded, skip cloudinary upload
    if (!req.file) {
      console.log('No file uploaded, skipping Cloudinary upload');
      return next();
    }

    // Log Cloudinary config (but not secret)
    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY?.slice(0,6) + '...',
    });

    // Determine folder and transformation based on file field name
    let folder = 'mentorlink-profiles';
    let transformation = [
      { width: 300, height: 300, crop: 'fill', gravity: 'face' },
      { quality: 'auto' }
    ];

    // Use different settings for event banners
    if (req.file.fieldname === 'banner') {
      folder = 'mentorlink-events';
      transformation = [
        { width: 1200, height: 630, crop: 'fill' },
        { quality: 'auto' }
      ];
    }

    // Create upload stream
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        transformation: transformation
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          // Check for specific Cloudinary errors
          if (error.http_code === 401) {
            return res.status(500).json({
              message: 'Image upload failed - invalid Cloudinary credentials',
              details: error.message
            });
          }
          return res.status(500).json({
            message: 'Image upload failed',
            details: error.message
          });
        }

        // Store Cloudinary result on request for next middleware
        req.cloudinaryResult = result;
        next();
      }
    );

    // Pipe file buffer to Cloudinary
    bufferToStream(req.file.buffer).pipe(stream);

  } catch (error) {
    console.error('Upload middleware error:', error);
    return res.status(500).json({
      message: 'Upload failed',
      details: error.message
    });
  }
};

module.exports = {
  upload,
  uploadToCloudinary
};

