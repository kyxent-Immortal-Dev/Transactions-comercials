import { Router } from 'express';
import { BuyOrderController } from '../controllers/BuyOrder.controller';

const router = Router();
const buyOrderController = new BuyOrderController();

// GET /api/buy-orders - Get all buy orders
router.get('/', (req, res) => buyOrderController.getAllBuyOrders(req, res));

// GET /api/buy-orders/:id - Get buy order by ID
router.get('/:id', (req, res) => buyOrderController.getBuyOrderById(req, res));

// GET /api/buy-orders/supplier/:supplierId - Get buy orders by supplier ID
router.get('/supplier/:supplierId', (req, res) => buyOrderController.getBuyOrdersBySupplierId(req, res));

// GET /api/buy-orders/quote/:quoteId - Get buy orders by quote ID
router.get('/quote/:quoteId', (req, res) => buyOrderController.getBuyOrdersByQuoteId(req, res));

// POST /api/buy-orders - Create new buy order
router.post('/', (req, res) => buyOrderController.createBuyOrder(req, res));

// PUT /api/buy-orders/:id - Update buy order
router.put('/:id', (req, res) => buyOrderController.updateBuyOrder(req, res));

// DELETE /api/buy-orders/:id - Delete buy order
router.delete('/:id', (req, res) => buyOrderController.deleteBuyOrder(req, res));

// Buy Order Details routes
// POST /api/buy-orders/details - Create new buy order detail
router.post('/details', (req, res) => buyOrderController.createBuyOrderDetail(req, res));

// GET /api/buy-orders/:buyOrderId/details - Get details by buy order ID
router.get('/:buyOrderId/details', (req, res) => buyOrderController.getBuyOrderDetailsByBuyOrderId(req, res));

// GET /api/buy-orders/details/:id - Get buy order detail by ID
router.get('/details/:id', (req, res) => buyOrderController.getBuyOrderDetailById(req, res));

// PUT /api/buy-orders/details/:id - Update buy order detail
router.put('/details/:id', (req, res) => buyOrderController.updateBuyOrderDetail(req, res));

// DELETE /api/buy-orders/details/:id - Delete buy order detail
router.delete('/details/:id', (req, res) => buyOrderController.deleteBuyOrderDetail(req, res));

export default router;