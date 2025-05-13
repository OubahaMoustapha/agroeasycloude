const { Admin, Client } = require('../models/user');

async function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const admin = await Admin.findOne({ token });
  if (!admin) return res.status(403).json({ error: 'Invalid token' });

  req.admin = admin;
  next();
}

async function verifyClient(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const client = await Client.findOne({ token });
  if (!client) return res.status(403).json({ error: 'Invalid token' });

  req.client = client;
  next();
}

module.exports = { verifyAdmin, verifyClient };
