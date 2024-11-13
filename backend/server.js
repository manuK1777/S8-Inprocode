const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/users');
const artistRoutes = require('./routes/artists');
const db = require('./config/db');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/artists', artistRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

db.getConnection()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection failed:', err));

