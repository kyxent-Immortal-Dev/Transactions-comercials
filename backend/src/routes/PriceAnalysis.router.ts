import { Router } from 'express';
import { PriceAnalysisController } from '../controllers/PriceAnalysis.controller';

const router = Router();
const ctrl = new PriceAnalysisController();

// Price Analysis
router.get('/', (req, res) => ctrl.getAll(req, res));
router.get('/retaceo/:retaceoId', (req, res) => ctrl.getByRetaceoId(req, res));
router.get('/:id', (req, res) => ctrl.getById(req, res));
router.post('/', (req, res) => ctrl.create(req, res));
router.post('/from-retaceo/:retaceoId', (req, res) => ctrl.createFromRetaceo(req, res));
router.post('/:id/apply', (req, res) => ctrl.apply(req, res));
router.put('/:id', (req, res) => ctrl.update(req, res));
router.delete('/:id', (req, res) => ctrl.delete(req, res));

// Details
router.get('/:id/details', (req, res) => ctrl.getDetails(req, res));
router.post('/details', (req, res) => ctrl.createDetail(req, res));
router.get('/details/:id', (req, res) => ctrl.getDetailById(req, res));
router.put('/details/:id', (req, res) => ctrl.updateDetail(req, res));
router.delete('/details/:id', (req, res) => ctrl.deleteDetail(req, res));

export default router;
