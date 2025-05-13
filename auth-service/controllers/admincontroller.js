const { Admin } = require('../models/user');
const { hashPassword, generateToken } = require('../utils/hash');

async function loginAdmin(req, res) {
  const { login, password } = req.body;
  const hashed = hashPassword(password);

  const admin = await Admin.findOne({ login, password: hashed });
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateToken();
  admin.token = token;
  await admin.save();

  res.json({ token });
}
async function logoutAdmin(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(400).json({ error: 'Token missing' });

    await Admin.findOneAndUpdate({ token }, { token: null });
    res.json({ message: 'Admin logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
}
module.exports = { loginAdmin,logoutAdmin };
