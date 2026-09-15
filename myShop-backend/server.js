import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load the variables into the environment
dotenv.config();

// Connection to the database
connectDB();

// Defines the http port
const PORT = 3000;

// Listen for connections
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
