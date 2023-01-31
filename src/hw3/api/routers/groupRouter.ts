import { Router } from 'express';
import groupService from '../../services/groupService';
import groupValidator from '../../services/groupValidator';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).send('Welcome to Temirlan NodeJS GMP Homework 2 API!');
})

router.post('/groups', groupValidator, groupService.createGroup);
router.get('/groups', groupService.getGroupsList);
router.get('/groups/:id', groupService.getGroupById);
router.put('/groups/:id', groupValidator, groupService.updateGroupById);
router.delete('/groups/:id', groupService.deleteGroupById);

export default router;