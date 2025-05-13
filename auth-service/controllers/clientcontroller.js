const { Client } = require('../models/user');
const { hashPassword, generateToken } = require('../utils/hash');

async function loginClient(req, res) {
  const { email, password } = req.body;
  const hashed = hashPassword(password);

  const client = await Client.findOne({ email, password: hashed });
  if (!client) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateToken();
  client.token = token;
  await client.save();

  res.json({ token });
}
async function logoutClient(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(400).json({ error: 'Token missing' });

    await Client.findOneAndUpdate({ token }, { token: null });
    res.json({ message: 'Client logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
}
async function getClients(req, res) {
  const clients = await Client.find();
  res.json(clients);
}

async function createClient(req, res) {
  const { nom, prenom, adresse, cin, tel, email, password, picture } = req.body;
  const hashed = hashPassword(password);

  const client = new Client({ nom, prenom, adresse, cin, tel, email, password: hashed, picture });
  await client.save();

  res.status(201).json(client);
}

async function updateClient(req, res) {
  const { id } = req.params;
  const updateData = req.body;

  if (updateData.password) {
    updateData.password = hashPassword(updateData.password);
  }

  const client = await Client.findByIdAndUpdate(id, updateData, { new: true });
  if (!client) return res.status(404).json({ error: 'Client not found' });

  res.json(client);
}

async function deleteClient(req, res) {
  const { id } = req.params;
  const client = await Client.findByIdAndDelete(id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  res.json({ message: 'Deleted' });
}
async function getClientProfile(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const client = await Client.findOne({ token }).select('-password -token');
    if (!client) return res.status(404).json({ error: 'Client not found' });

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
module.exports = { loginClient,logoutClient, getClients, createClient, updateClient, deleteClient,getClientProfile };
