const db = require('../config/db');


// exports.getAllUsers = async (req, res) => {
//   const [users] = await db.query('SELECT * FROM users');
//   res.json(users);
// };

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database connection error' }); 
  }
};


exports.getUserById = async (req, res) => {
  const [user] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
  res.json(user[0]);
};


exports.createUser = async (req, res) => {
  const { first, last, email, phone, location, hobby, age } = req.body;
  const result = await db.query('INSERT INTO users (first, last, email, phone, location, hobby, age) VALUES (?, ?, ?, ?, ?, ?, ?)', [first, last, email, phone, location, hobby, age]);
  res.json({ id: result[0].insertId, first, last, email, phone, location, hobby, age });
};


exports.updateUser = async (req, res) => {
  const { first, last, email, phone, location, hobby, age } = req.body;
  await db.query('UPDATE users SET first = ?, last = ?, email = ?, phone = ?, location = ?, hobby = ?, age = ? WHERE id = ?', [first, last, email, phone, location, hobby, age, req.params.id]);
  res.json({ id: req.params.id, first, last, email, phone, location, hobby, age });
};


exports.deleteUser = async (req, res) => {
  await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ message: 'User deleted' });
};