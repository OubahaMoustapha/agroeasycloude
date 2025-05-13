const axios = require('axios');

const verifyToken = async (token) => {
  const response = await axios.post('http://auth-service:3001/api/auth/verify-token', { token });
  return response.data;
};

const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const data = await verifyToken(token);
    if (data.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access only' });
    }
    req.user = data.user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const verifyClient = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const data = await verifyToken(token);
    if (data.role !== 'client') {
      return res.status(403).json({ error: 'Client access only' });
    }
    req.user = data.user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { verifyAdmin, verifyClient };
