const express = require('express');
const router = express.Router();
const { Admin, Client } = require('../models/user');

router.post('/verify-token', async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ error: 'Token is required' });

  try {
    const admin = await Admin.findOne({ token });
    if (admin) {
      return res.status(200).json({ valid: true, role: 'admin', user: admin });
    }

    const client = await Client.findOne({ token });
    if (client) {
      return res.status(200).json({ valid: true, role: 'client', user: client });
    }

    return res.status(403).json({ error: 'Invalid token' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
