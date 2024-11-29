const fs = require('fs');
const db = require('../config/db');
const path = require("path");

exports.getAllArtist = async (req, res) => {
  try {
    const [artists] = await db.query("SELECT * FROM artists");

     
      const artistsWithPhoto = artists.map(artist => ({
        ...artist,
        photo: artist.photo || null, 
      }));

      res.json(artistsWithPhoto);

      // res.json(artists);

  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve artists" });
  }
};

exports.getArtistById = async (req, res) => {
  const { id } = req.params;
  try {
    const [artist] = await db.query("SELECT * FROM artists WHERE id = ?", [id]);
    if (!artist[0]) return res.status(404).json({ error: "Artist not found" });

   
     const artistWithPhoto = {
      ...artist[0],
      photo: artist[0].photo || null, 
    };

    res.json(artistWithPhoto);

    // res.json(artist[0]);

  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve artist" });
  }
};

exports.createArtist = async (req, res) => {
  const { artistName, email, webPage, contact, phone } = req.body;
  const photo = req.file ? req.file.filename : null;

  if (!artistName || !email || !contact || !phone) {
    return res.status(400).json({
      error: "Missing required fields",
      received: req.body,
    });
  }

  try {
    const result = await db.query(
      "INSERT INTO artists (artistName, email, webPage, contact, phone, photo) VALUES (?, ?, ?, ?, ?, ?)",
      [artistName, email, webPage || null, contact, phone, photo]
    );

    const newArtist = {
      id: result[0].insertId,
      artistName,
      email,
      webPage,
      contact,
      phone,
      photo,
    };

    res.status(201).json(newArtist);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Failed to create artist",
      details: error.message,
    });
  }
};

// Update an existing artist
exports.updateArtist = async (req, res) => {
  const { id } = req.params;
  const { artistName, email, webPage, contact, phone } = req.body;
  const photo = req.file ? req.file.filename : null; 

  try {
    // Check if the artist exists
    const [existingArtist] = await db.query("SELECT * FROM artists WHERE id = ?", [id]);
    if (!existingArtist.length) {
      return res.status(404).json({ error: "Artist not found" });
    }

    // Update only provided fields or fallback to existing values
    const updatedArtist = {
      artistName: artistName || existingArtist[0].artistName,
      email: email || existingArtist[0].email,
      webPage: webPage || existingArtist[0].webPage,
      contact: contact || existingArtist[0].contact,
      phone: phone || existingArtist[0].phone,
      photo: photo || existingArtist[0].photo, // Retain existing photo if no new one is uploaded
    };

    // Perform the update
    await db.query(
      "UPDATE artists SET artistName = ?, email = ?, webPage = ?, contact = ?, phone = ?, photo = ? WHERE id = ?",
      [
        updatedArtist.artistName,
        updatedArtist.email,
        updatedArtist.webPage,
        updatedArtist.contact,
        updatedArtist.phone,
        updatedArtist.photo,
        id,
      ]
    );

    res.json(updatedArtist);
  } catch (error) {
    console.error("Failed to update artist:", error);
    res.status(500).json({ error: "Failed to update artist", details: error.message });
  }
};

// Delete an artist
exports.deleteArtist = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM artists WHERE id = ?", [id]);
    res.json({ message: "Artist deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete artist" });
  }
};

exports.deleteArtistImage = async (req, res) => {
  const { id } = req.params;

  try {
    // Retrieve artist by ID
    const [artist] = await db.query('SELECT photo FROM artists WHERE id = ?', [id]);
    if (!artist.length) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    const photoPath = artist[0].photo
      ? path.join(__dirname, '../uploads', artist[0].photo)
      : null;

    if (photoPath && fs.existsSync(photoPath)) {
      // Delete the photo file
      fs.unlinkSync(photoPath);
      console.log(`Deleted file: ${photoPath}`);
    }

    // Update database to remove photo reference
    await db.query('UPDATE artists SET photo = NULL WHERE id = ?', [id]);

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
};
