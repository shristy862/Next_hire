import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './utils/db.js';
import authRoutes from './userData/Routes/authRoutes.js';
import forgotPasswordRoutes from './userData/Routes/forgotPasswordRoutes.js'; 

dotenv.config();
connectDB();

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Routes for signup users
app.use('/auth', authRoutes);

// Forgot password routes
app.use('/password', forgotPasswordRoutes); // Use the routes, not the controller

// Base route
app.get('/', (req, res) => {
  res.send('Hello! This is SNS Demo API');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
