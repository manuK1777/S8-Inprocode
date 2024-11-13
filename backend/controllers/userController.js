const db = require('../config/db');

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
  try {
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!user[0]) return res.status(404).json({ error: 'User not found' });
    res.json(user[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database connection error' }); 
  }
};

exports.createUser = async (req, res) => {
  const { first, last, email, phone, location, hobby, age } = req.body;
  const result = await db.query('INSERT INTO users (first, last, email, phone, location, hobby, age) VALUES (?, ?, ?, ?, ?, ?, ?)', [first, last, email, phone, location, hobby, age]);
  res.json({ id: result[0].insertId, first, last, email, phone, location, hobby, age });
};

exports.updateUser = async (req, res) => {
  try {
    const { first, last, email, phone, location, hobby, age } = req.body;
    await db.query('UPDATE users SET first = ?, last = ?, email = ?, phone = ?, location = ?, hobby = ?, age = ? WHERE id = ?', [first, last, email, phone, location, hobby, age, req.params.id]);
    res.json({ id: req.params.id, first, last, email, phone, location, hobby, age });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database connection error' }); 
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database connection error' }); 
  }
};
