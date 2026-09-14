import express from 'express';
import { transformMessage } from '../middlewares/transform.middleware.js';
import { validateAddMessage, validateUpdMessage } from '../middlewares/message.validation.js';
import {
  getMessagesByEmail,
  getMessageById,
  addMessage,
  updateMessage,
  patchDateRep,
  patchVisible,
  deleteMessage,
} from '../controllers/message.controller.js';

// Define the routes
const router = express.Router();

// http://localhost:3000/api/messages
router.get('/messages/:email/email', getMessagesByEmail);
router.get('/messages/:id', getMessageById);
router.post('/messages', transformMessage, validateAddMessage, addMessage);
router.put('/messages/:id', transformMessage, validateUpdMessage, updateMessage);
router.patch('/messages/:id/daterep', transformMessage, validateUpdMessage, patchDateRep);
router.patch('/messages/:id/visible', transformMessage, validateUpdMessage, patchVisible);
router.delete('/messages/:id', deleteMessage);

export default router;
