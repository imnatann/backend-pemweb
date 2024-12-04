import { Router } from 'express';
import { getAksesUsers, getAksesUserById, createAksesUser, updateAksesUser, deleteAksesUser } from '../controllers/aksesUserController';

const router = Router();

router.get('/', getAksesUsers);
router.get('/:idakses', getAksesUserById);
router.post('/', createAksesUser);
router.put('/:idakses', updateAksesUser);
router.delete('/:idakses', deleteAksesUser);

export default router;
