import { Router } from 'express';
import { ClientController } from '../controllers/Client.controller';

const router = Router();
const clientController = new ClientController();

// GET /api/clients - Get all clients
router.get('/', (req, res) => clientController.getAllClients(req, res));

// GET /api/clients/:id - Get client by ID
router.get('/:id', (req, res) => clientController.getClientById(req, res));

// POST /api/clients - Create new client
router.post('/', (req, res) => clientController.createClient(req, res));

// PUT /api/clients/:id - Update client
router.put('/:id', (req, res) => clientController.updateClient(req, res));

// DELETE /api/clients/:id - Delete client
router.delete('/:id', (req, res) => clientController.deleteClient(req, res));

export default router;