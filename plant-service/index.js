const express = require('express');
const connectDB = require('./db'); 
const plantRoutes = require('./routes/plantRoutes');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
const port = 3004;


app.use(express.json());

connectDB().then(() => {
  app.use('/api/plants', plantRoutes);

  app.listen(port, () => {
    console.log(`Plant service running on port ${port}`);
  });
});