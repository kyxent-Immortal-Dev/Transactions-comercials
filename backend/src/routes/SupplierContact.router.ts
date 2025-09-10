import { Router } from 'express';
import { SupplierContactController } from '../controllers/SupplierContact.controller';

const router = Router();
const supplierContactController = new SupplierContactController();

// GET /api/supplier-contacts - Get all supplier contacts
router.get('/', (req, res) => supplierContactController.getAllSupplierContacts(req, res));

// GET /api/supplier-contacts/:id - Get supplier contact by ID
router.get('/:id', (req, res) => supplierContactController.getSupplierContactById(req, res));

// GET /api/supplier-contacts/supplier/:supplierId - Get contacts by supplier ID
router.get('/supplier/:supplierId', (req, res) => supplierContactController.getSupplierContactsBySupplierId(req, res));

// POST /api/supplier-contacts - Create new supplier contact
router.post('/', (req, res) => supplierContactController.createSupplierContact(req, res));

// PUT /api/supplier-contacts/:id - Update supplier contact
router.put('/:id', (req, res) => supplierContactController.updateSupplierContact(req, res));

// DELETE /api/supplier-contacts/:id - Delete supplier contact
router.delete('/:id', (req, res) => supplierContactController.deleteSupplierContact(req, res));

export default router;