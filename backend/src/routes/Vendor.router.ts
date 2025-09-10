import { Router } from 'express';
import { VendorController } from '../controllers/Vendor.controller';

const router = Router();
const vendorController = new VendorController();

// GET /api/vendors - Get all vendors
router.get('/', (req, res) => vendorController.getAllVendors(req, res));

// GET /api/vendors/:id - Get vendor by ID
router.get('/:id', (req, res) => vendorController.getVendorById(req, res));

// POST /api/vendors - Create new vendor
router.post('/', (req, res) => vendorController.createVendor(req, res));

// PUT /api/vendors/:id - Update vendor
router.put('/:id', (req, res) => vendorController.updateVendor(req, res));

// DELETE /api/vendors/:id - Delete vendor
router.delete('/:id', (req, res) => vendorController.deleteVendor(req, res));

export default router;