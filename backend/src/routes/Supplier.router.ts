import { Router } from 'express';
import { SupplierController } from '../controllers/Supplier.controller';

const router = Router();
const supplierController = new SupplierController();

// GET /api/suppliers - Get all suppliers
router.get('/', (req, res) => supplierController.getAllSuppliers(req, res));

// GET /api/suppliers/:id - Get supplier by ID
router.get('/:id', (req, res) => supplierController.getSupplierById(req, res));

// POST /api/suppliers - Create new supplier
router.post('/', (req, res) => supplierController.createSupplier(req, res));

// PUT /api/suppliers/:id - Update supplier
router.put('/:id', (req, res) => supplierController.updateSupplier(req, res));

// DELETE /api/suppliers/:id - Delete supplier
router.delete('/:id', (req, res) => supplierController.deleteSupplier(req, res));

export default router;