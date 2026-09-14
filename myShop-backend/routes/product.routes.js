import express from 'express';
import { transformProduct } from '../middlewares/transform.middleware.js';
import { validateAddProduct, validateUpdProduct } from '../middlewares/product.validation.js';
import {
  getAllProducts,
  getFirstProducts,
  getProductsByUserId,
  getProductsByIDs,
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
router.get('/products/:maxCount/first', getFirstProducts);
router.get('/products/:userId/user', getProductsByUserId);
router.get('/products/:IDs/list', getProductsByIDs);
router.get('/products/:id', getProductById);
router.post('/products', validateAddProduct, addProduct);
router.put('/products/:id', transformProduct, validateUpdProduct, updateProduct);
router.patch('/products/:id/price', transformProduct, validateUpdProduct, patchPrice);
router.patch('/products/:id/stock', transformProduct, validateUpdProduct, patchStock);
router.patch('/products/:id/favorite', transformProduct, validateUpdProduct, patchFavorite);
router.patch('/products/:id/visible', transformProduct, validateUpdProduct, patchVisible);
router.delete('/products/:id', deleteProduct);

export default router;
