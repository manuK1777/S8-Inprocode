const db = require("../config/db");
const path = require("path");

const multer = require("multer");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../uploads")); 
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // Generate unique file name
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
    }
  },
});

exports.getAllArtist = async (req, res) => {
  try {
    const [artists] = await db.query("SELECT * FROM artists");
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve artists" });
  }
};

exports.getArtistById = async (req, res) => {
  const { id } = req.params;
  try {
    const [artist] = await db.query("SELECT * FROM artists WHERE id = ?", [id]);
    if (!artist[0]) return res.status(404).json({ error: "Artist not found" });
    res.json(artist[0]);
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

exports.updateArtist = async (req, res) => {
  const { id } = req.params;
  const { artistName, email, webPage, contact, phone } = req.body;
  try {
    await db.query(
      "UPDATE artists SET artistName = ?, email = ?, webPage = ?, contact = ?, phone = ? WHERE id = ?",
      [artistName, email, webPage, contact, phone, id]
    );
    res.json({ id, artistName, email, webPage, contact, phone });
  } catch (error) {
    res.status(500).json({ error: "Failed to update artist" });
  }
};

exports.deleteArtist = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM artists WHERE id = ?", [id]);
    res.json({ message: "Artist deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete artist" });
  }
};
