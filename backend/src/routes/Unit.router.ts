import { Router } from 'express';
import { UnitController } from '../controllers/Unit.controller';

const router = Router();
const unitController = new UnitController();

// GET /api/units - Get all units
router.get('/', (req, res) => unitController.getAllUnits(req, res));

// GET /api/units/:id - Get unit by ID
router.get('/:id', (req, res) => unitController.getUnitById(req, res));

// POST /api/units - Create new unit
router.post('/', (req, res) => unitController.createUnit(req, res));

// PUT /api/units/:id - Update unit
router.put('/:id', (req, res) => unitController.updateUnit(req, res));

// DELETE /api/units/:id - Delete unit
router.delete('/:id', (req, res) => unitController.deleteUnit(req, res));

export default router;