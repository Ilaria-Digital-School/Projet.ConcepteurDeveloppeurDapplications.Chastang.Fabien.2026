import express from 'express';
import {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  patchRole,
  patchCountry,
  patchVisible,
  deleteUser,
} from '../controllers/user.controller.js';

// Define the routes
const router = express.Router();

// http://localhost:3000/api/users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', addUser);
router.put('/users/:id', updateUser);
router.patch('/users/:id/role', patchRole);
router.patch('/users/:id/country', patchCountry);
router.patch('/users/:id/visible', patchVisible);
router.delete('/users/:id', deleteUser);

export default router;
