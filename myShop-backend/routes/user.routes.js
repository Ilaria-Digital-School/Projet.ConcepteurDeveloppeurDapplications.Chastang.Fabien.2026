import express from 'express';
import { transformUser } from '../middlewares/transform.middleware.js';
import { validateAddUser, validateUpdUser } from '../middlewares/user.validation.js';
import {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  patchEmail,
  patchPassword,
  patchRole,
  patchVisible,
  deleteUser,
} from '../controllers/user.controller.js';

// Define the routes
const router = express.Router();

// http://localhost:3000/api/users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', transformUser, validateAddUser, addUser);
router.put('/users/:id', validateUpdUser, updateUser);
router.patch('/users/:id/email', patchEmail);
router.patch('/users/:id/password', patchPassword);
router.patch('/users/:id/role', patchRole);
router.patch('/users/:id/visible', patchVisible);
router.delete('/users/:id', deleteUser);

export default router;
