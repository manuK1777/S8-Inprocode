const express = require('express');
const router = express.Router();
const artistsController = require('../controllers/artistsController');

router.get('/', artistsController.getAllArtist);
router.post('/', artistsController.createArtist);
router.get('/:id', artistsController.getArtistById);
router.put('/:id', artistsController.updateArtist);
router.delete('/:id', artistsController.deleteArtist);

module.exports = router;
