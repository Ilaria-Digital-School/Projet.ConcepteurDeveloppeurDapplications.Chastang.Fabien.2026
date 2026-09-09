import express from 'express';
import { corsMiddleware } from './cors/cors.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';

// Creates an Express application
// The express() function is a top-level function exported by the express module
const app = express();
app.use(express.json());

// `app.use(cors())` allows everything, which is not sufficiently secure
app.use(corsMiddleware);

// Adding routes
app.use('/api', userRoutes);
app.use('/api', productRoutes);

export default app;
