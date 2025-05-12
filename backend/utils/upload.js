import multer from 'multer';
import { storage } from '../config/cloudinary.js';

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const uploadUserPhoto = upload.single('avatar');

// No need for sharp resizing since Cloudinary handles it