import { Router } from 'express';
import { ExpenseTypeController } from '../controllers/ExpenseType.controller';

const router = Router();
const ctrl = new ExpenseTypeController();

router.get('/', (req, res) => ctrl.getAll(req, res));
router.get('/:id', (req, res) => ctrl.getById(req, res));
router.post('/', (req, res) => ctrl.create(req, res));
router.put('/:id', (req, res) => ctrl.update(req, res));
router.delete('/:id', (req, res) => ctrl.delete(req, res));

export default router;
