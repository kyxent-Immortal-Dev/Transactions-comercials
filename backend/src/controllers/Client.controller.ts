import { Request, Response } from 'express';
import { ClientRepositoryImpl } from '../repositories/Client.repository';
import { CreateClientRequest, UpdateClientRequest } from '../interfaces/Client.interface';

export class ClientController {
  private clientRepository: ClientRepositoryImpl;

  constructor() {
    this.clientRepository = new ClientRepositoryImpl();
  }

  async getAllClients(req: Request, res: Response): Promise<void> {
    try {
      const clients = await this.clientRepository.findAll();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching clients' });
    }
  }

  async getClientById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const client = await this.clientRepository.findById(id);
      
      if (!client) {
        res.status(404).json({ error: 'Client not found' });
        return;
      }
      
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching client' });
    }
  }

  async createClient(req: Request, res: Response): Promise<void> {
    try {
      const clientData: CreateClientRequest = req.body;
      const client = await this.clientRepository.create(clientData);
      res.status(201).json(client);
    } catch (error) {
      res.status(500).json({ error: 'Error creating client' });
    }
  }

  async updateClient(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const clientData: UpdateClientRequest = req.body;
      const client = await this.clientRepository.update(id, clientData);
      
      if (!client) {
        res.status(404).json({ error: 'Client not found' });
        return;
      }
      
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: 'Error updating client' });
    }
  }

  async deleteClient(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.clientRepository.delete(id);
      
      if (!success) {
        res.status(404).json({ error: 'Client not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting client' });
    }
  }
}