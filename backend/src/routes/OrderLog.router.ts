import { Router } from 'express';
import { OrderLogController } from '../controllers/OrderLog.controller';

const router = Router();
const ctrl = new OrderLogController();

router.get('/', (req, res) => ctrl.getAll(req, res));
router.get('/:id', (req, res) => ctrl.getById(req, res));
router.get('/buy-order/:buyOrderId', (req, res) => ctrl.getByBuyOrderId(req, res));
router.post('/', (req, res) => ctrl.create(req, res));
router.put('/:id', (req, res) => ctrl.update(req, res));
router.delete('/:id', (req, res) => ctrl.delete(req, res));

export default router;
