import { Router } from 'express';
import { QuoteController } from '../controllers/Quote.controller';

const router = Router();
const quoteController = new QuoteController();

// GET /api/quotes - Get all quotes
router.get('/', (req, res) => quoteController.getAllQuotes(req, res));

// GET /api/quotes/:id - Get quote by ID
router.get('/:id', (req, res) => quoteController.getQuoteById(req, res));

// GET /api/quotes/supplier/:supplierId - Get quotes by supplier ID
router.get('/supplier/:supplierId', (req, res) => quoteController.getQuotesBySupplierId(req, res));

// POST /api/quotes - Create new quote
router.post('/', (req, res) => quoteController.createQuote(req, res));

// PUT /api/quotes/:id - Update quote
router.put('/:id', (req, res) => quoteController.updateQuote(req, res));

// DELETE /api/quotes/:id - Delete quote
router.delete('/:id', (req, res) => quoteController.deleteQuote(req, res));

// Quote Details routes
// POST /api/quotes/details - Create new quote detail
router.post('/details', (req, res) => quoteController.createQuoteDetail(req, res));

// GET /api/quotes/:quoteId/details - Get details by quote ID
router.get('/:quoteId/details', (req, res) => quoteController.getQuoteDetailsByQuoteId(req, res));

// GET /api/quotes/details/:id - Get quote detail by ID
router.get('/details/:id', (req, res) => quoteController.getQuoteDetailById(req, res));

// PUT /api/quotes/details/:id - Update quote detail
router.put('/details/:id', (req, res) => quoteController.updateQuoteDetail(req, res));

// DELETE /api/quotes/details/:id - Delete quote detail
router.delete('/details/:id', (req, res) => quoteController.deleteQuoteDetail(req, res));

export default router;