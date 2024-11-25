const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const artistsController = require('../controllers/artistsController');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../uploads');
      console.log('Multer saving to directory:', uploadPath); // Debug log to confirm directory
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
      console.log('Multer generated filename:', uniqueName); // Debug log to confirm filename
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});


router.post('/', upload.single('photo'), artistsController.createArtist);
router.get('/', artistsController.getAllArtist);
router.get('/:id', artistsController.getArtistById);
router.put('/:id', artistsController.updateArtist);
router.delete('/:id', artistsController.deleteArtist);


module.exports = router;
