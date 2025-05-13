const express = require('express');
const cors = require('cors');
const app = express();
const productRoutes = require('./routes/productRoutes');
const path = require('path');
const connectDB = require('./db');

// Simplified CORS
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/products', productRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

connectDB()
  .then(() => {
    app.listen(3003, () => {
      console.log('✅ Product service running on port 3003');
      console.log('🔗 Endpoint: http://localhost:4002/api/products');
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });