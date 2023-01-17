import { Router } from 'express';
import UserService from '../../services/userService';
import userValidator from '../../services/userValidator';

const router = Router();


router.get('/', (_req, res) => {
  res.status(200).send('Welcome to Temirlan NodeJS GMP Homework 2 API!');
})

router.post('/users', userValidator, UserService.createUser);
router.get('/users/all', UserService.getAllUsers);
router.get('/users', UserService.getUsersList);
router.get('/users/:id', UserService.getUserById);
router.put('/users/:id', userValidator, UserService.updateUserById);
router.delete('/users/:id', UserService.deleteUserById);

export default router;