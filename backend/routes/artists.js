const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const artistsController = require('../controllers/artistsController');

// Multer Configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../uploads');
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'));
    }
    cb(null, true);
  },
});

router.post('/', upload.single('photo'), artistsController.createArtist);
router.get('/', artistsController.getAllArtist);
router.get('/:id', artistsController.getArtistById);
router.put('/:id', upload.single('photo'), artistsController.updateArtist); // Added multer for PUT
router.delete('/:id', artistsController.deleteArtist);

module.exports = router;


// Routes
// router.post('/api/artists', upload.single('photo'), artistsController.createArtist);
// router.put('/api/artists/:id', upload.single('photo'), artistsController.updateArtist);
// router.get('/api/artists', artistsController.getAllArtist);
// router.get('/api/artists/:id', artistsController.getArtistById);
// router.delete('/api/artists/:id', artistsController.deleteArtist);




