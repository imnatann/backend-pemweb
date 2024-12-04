import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

router.get('/', getUsers);
router.get('/:iduser', getUserById);
router.post('/', createUser);
router.put('/:iduser', updateUser);
router.delete('/:iduser', deleteUser);

export default router;
