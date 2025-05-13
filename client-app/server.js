const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-panel.html'));
});

app.get('/admin/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'product-panel.html'));
});

app.get('/admin/plants', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'plant-panel.html'));
});

// Add these to your server.js
app.get('/client/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client-login.html'));
});
app.get('/client/other-plants', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'other-plants.html'));
});
app.get('/client/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client-dashboard.html'));
});

app.get('/client/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client-products.html'));
});

app.get('/client/plants', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client-plants.html'));
});

app.get('/client/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client-profile.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin login: http://localhost:${PORT}/admin/login`);
  console.log(`Admin dashboard: http://localhost:${PORT}/admin/dashboard`);
  console.log(`Product panel: http://localhost:${PORT}/admin/products`);
  console.log(`Plant panel: http://localhost:${PORT}/admin/plants`);
  console.log(`Client interface: http://localhost:${PORT}/client/login`);
});