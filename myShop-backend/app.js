import express from 'express';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';

// Creates an Express application
// The express() function is a top-level function exported by the express module
const app = express();
app.use(express.json());

// Adding routes
app.use('/api', userRoutes);
app.use('/api', productRoutes);

export default app;
