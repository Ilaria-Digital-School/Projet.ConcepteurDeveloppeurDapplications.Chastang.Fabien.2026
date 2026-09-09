import express from 'express';
import { validateAddProd, validateUpdProd } from '../middlewares/product.validation.js';
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  patchPrice,
  patchStock,
  patchFavorite,
  patchVisible,
  deleteProduct,
} from '../controllers/product.controller.js';

// Define the routes
const router = express.Router();

// http://localhost:3000/api/products
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', validateAddProd, addProduct);
router.put('/products/:id', validateUpdProd, updateProduct);
router.patch('/products/:id/price', patchPrice);
router.patch('/products/:id/stock', patchStock);
router.patch('/products/:id/favorite', patchFavorite);
router.patch('/products/:id/visible', patchVisible);
router.delete('/products/:id', deleteProduct);

export default router;
