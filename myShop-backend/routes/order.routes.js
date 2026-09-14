import express from 'express';
import { transformOrder } from '../middlewares/transform.middleware.js';
import { validateAddOrder, validateUpdOrder } from '../middlewares/order.validation.js';
import {
  getAllOrders,
  getOrdersByUserId,
  getOrdersByIDs,
  getOrderById,
  addOrder,
  updateOrder,
  patchStatus,
  patchVisible,
  deleteOrder,
} from '../controllers/order.controller.js';

// Define the routes
const router = express.Router();

// http://localhost:3000/api/orders
router.get('/orders', getAllOrders);
router.get('/orders/:userId/user', getOrdersByUserId);
router.get('/orders/:IDs/list', getOrdersByIDs);
router.get('/orders/:id', getOrderById);
router.post('/orders', transformOrder, validateAddOrder, addOrder);
router.put('/orders/:id', transformOrder, validateUpdOrder, updateOrder);
router.patch('/orders/:id/status', transformOrder, validateUpdOrder, patchStatus);
router.patch('/orders/:id/visible', transformOrder, validateUpdOrder, patchVisible);
router.delete('/orders/:id', deleteOrder);

export default router;
