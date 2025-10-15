import { Router } from 'express';
import { PurchaseController } from '../controllers/Purchase.controller';

const router = Router();
const ctrl = new PurchaseController();

// Purchase
router.get('/', (req, res) => ctrl.getAll(req, res));
router.get('/buy-order/:buyOrderId', (req, res) => ctrl.getByBuyOrderId(req, res));
router.get('/:id', (req, res) => ctrl.getById(req, res));
router.post('/', (req, res) => ctrl.create(req, res));
router.put('/:id', (req, res) => ctrl.update(req, res));
router.delete('/:id', (req, res) => ctrl.delete(req, res));

// Details
router.post('/details', (req, res) => ctrl.createDetail(req, res));
router.get('/:purchaseId/details', (req, res) => ctrl.getDetailsByPurchaseId(req, res));
router.get('/details/:id', (req, res) => ctrl.getDetailById(req, res));
router.put('/details/:id', (req, res) => ctrl.updateDetail(req, res));
router.delete('/details/:id', (req, res) => ctrl.deleteDetail(req, res));

export default router;
