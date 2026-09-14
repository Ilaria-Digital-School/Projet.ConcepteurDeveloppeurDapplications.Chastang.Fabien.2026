import express from 'express';
import { corsMiddleware } from './cors/cors.js';
import { successHandler } from './middlewares/success.handler.js';
import { errorHandler } from './middlewares/error.handler.js';
import categoryRoutes from './routes/category.routes.js';
import countryRoutes from './routes/country.routes.js';
import genderRoutes from './routes/gender.routes.js';
import interestRoutes from './routes/interest.routes.js';
import messageRoutes from './routes/message.routes.js';
import orderRoutes from './routes/order.routes.js';
import productRoutes from './routes/product.routes.js';
import roleRoutes from './routes/role.routes.js';
import statusRoutes from './routes/status.routes.js';
import userRoutes from './routes/user.routes.js';

// Creates an Express application
// The express() function is a top-level function exported by the express module
const app = express();
app.use(express.json());

// `app.use(cors())` allows everything, which is not sufficiently secure
app.use(corsMiddleware);

// Before adding the routes
// Otherwise, an error occurs: `res.success is not a function`
app.use(successHandler);

// Adding routes
app.use('/api', categoryRoutes);
app.use('/api', countryRoutes);
app.use('/api', genderRoutes);
app.use('/api', interestRoutes);
app.use('/api', messageRoutes);
app.use('/api', orderRoutes);
app.use('/api', productRoutes);
app.use('/api', roleRoutes);
app.use('/api', statusRoutes);
app.use('/api', userRoutes);

// Always at the end of the process to catch errors
app.use(errorHandler);

export default app;
