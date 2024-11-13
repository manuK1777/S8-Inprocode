const db = require('../config/db');

// Get all artists
exports.getAllArtist = async (req, res) => {
  try {
    const [artists] = await db.query('SELECT * FROM artists');
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve artists' });
  }
};

// Get artist by id
exports.getArtistById = async (req, res) => {
  const { id } = req.params;
  try {
    const [artist] = await db.query('SELECT * FROM artists WHERE id = ?', [id]);
    if (!artist[0]) return res.status(404).json({ error: 'Artist not found' });
    res.json(artist[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve artist' });
  }
};

// Create a new artist
// exports.createArtist = async (req, res) => {
//   const { artistName, email, webPage, contact, phone } = req.body;
//   try {
//     const result = await db.query('INSERT INTO artists (artistName, email, webPage, contact, phone) VALUES (?, ?, ?, ?, ?)', [artistName, email, webPage, contact, phone]);
//     res.json({ id: result[0].insertId, artistName, email, webPage, contact, phone });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create artist' });
//   }
// };

// Create a new artist
exports.createArtist = async (req, res) => {
  const { artistName, email, webPage, contact, phone } = req.body;
  
  try {
    console.log('Received data:', req.body);
    
    if (!artistName || !email || !contact || !phone) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: req.body 
      });
    }

    const result = await db.query(
      'INSERT INTO artists (artistName, email, webPage, contact, phone) VALUES (?, ?, ?, ?, ?)',
      [artistName, email, webPage || null, contact, phone]
    );

    const newArtist = {
      id: result[0].insertId,
      artistName,
      email,
      webPage,
      contact,
      phone
    };

    res.status(201).json(newArtist);
  } catch (error) {
    console.error('Database error:', error); 
    res.status(500).json({ 
      error: 'Failed to create artist',
      details: error.message 
    });
  }
};

// Update artist
exports.updateArtist = async (req, res) => {
  const { id } = req.params;
  const { artistName, email, webPage, contact, phone } = req.body;
  try {
    await db.query('UPDATE artists SET artistName = ?, email = ?, webPage = ?, contact = ?, phone = ? WHERE id = ?', [artistName, email, webPage, contact, phone, id]);
    res.json({ id, artistName, email, webPage, contact, phone });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update artist' });
  }
};

// Delete artist
exports.deleteArtist = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM artists WHERE id = ?', [id]);
    res.json({ message: 'Artist deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete artist' });
  }
};