import { Router } from 'express';
import { RetaceoController } from '../controllers/Retaceo.controller';

const router = Router();
const ctrl = new RetaceoController();

// Cálculos de retaceo (deben ir antes de las rutas con :id)
router.post('/calculate', (req, res) => ctrl.calculateRetaceo(req, res));
router.post('/create-with-calculation', (req, res) => ctrl.createWithCalculation(req, res));

// Retaceo CRUD
router.get('/', (req, res) => ctrl.getAll(req, res));
router.get('/purchase/:purchaseId', (req, res) => ctrl.getByPurchaseId(req, res));
router.get('/:id', (req, res) => ctrl.getById(req, res));
router.post('/', (req, res) => ctrl.create(req, res));
router.put('/:id', (req, res) => ctrl.update(req, res));
router.delete('/:id', (req, res) => ctrl.delete(req, res));
router.post('/:id/approve', (req, res) => ctrl.approveRetaceo(req, res));

// Details
router.post('/details', (req, res) => ctrl.createDetail(req, res));
router.get('/:retaceoId/details', (req, res) => ctrl.getDetailsByRetaceoId(req, res));
router.get('/details/:id', (req, res) => ctrl.getDetailById(req, res));
router.put('/details/:id', (req, res) => ctrl.updateDetail(req, res));
router.delete('/details/:id', (req, res) => ctrl.deleteDetail(req, res));

export default router;
