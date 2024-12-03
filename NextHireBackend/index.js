import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './Routes/authRoutes.js';

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Hello! This is SNS Demo API');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
