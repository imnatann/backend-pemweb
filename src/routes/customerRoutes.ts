import { Router } from 'express';
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController';

const router = Router();

router.get('/', getCustomers);
router.get('/:idcustomer', getCustomerById);
router.post('/', createCustomer);
router.put('/:idcustomer', updateCustomer);
router.delete('/:idcustomer', deleteCustomer);

export default router;
