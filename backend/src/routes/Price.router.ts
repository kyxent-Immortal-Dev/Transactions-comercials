import { Router } from 'express';
import { PriceController } from '../controllers/Price.controller';

const router = Router();
const ctrl = new PriceController();

// Price Routes
router.get('/prices', (req, res) => ctrl.getAllPrices(req, res));
router.get('/prices/product/:productId', (req, res) => ctrl.getCurrentPriceByProductId(req, res));
router.get('/prices/:id', (req, res) => ctrl.getPriceById(req, res));
router.post('/prices', (req, res) => ctrl.createPrice(req, res));
router.put('/prices/:id', (req, res) => ctrl.updatePrice(req, res));
router.delete('/prices/:id', (req, res) => ctrl.deletePrice(req, res));

// Price History Routes
router.get('/history', (req, res) => ctrl.getAllPriceHistory(req, res));
router.get('/history/product/:productId', (req, res) => ctrl.getPriceHistoryByProductId(req, res));
router.get('/history/analysis/:analysisId', (req, res) => ctrl.getPriceHistoryByAnalysisId(req, res));
router.get('/history/:id', (req, res) => ctrl.getPriceHistoryById(req, res));
router.post('/history', (req, res) => ctrl.createPriceHistory(req, res));
router.put('/history/:id', (req, res) => ctrl.updatePriceHistory(req, res));
router.delete('/history/:id', (req, res) => ctrl.deletePriceHistory(req, res));

export default router;
