import { Request, Response } from 'express';
import { UnitRepositoryImpl } from '../repositories/Unit.repository';
import { CreateUnitRequest, UpdateUnitRequest } from '../interfaces/Unit.interface';

export class UnitController {
  private unitRepository: UnitRepositoryImpl;

  constructor() {
    this.unitRepository = new UnitRepositoryImpl();
  }

  async getAllUnits(req: Request, res: Response): Promise<void> {
    try {
      const units = await this.unitRepository.findAll();
      res.json(units);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching units' });
    }
  }

  async getUnitById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const unit = await this.unitRepository.findById(id);
      
      if (!unit) {
        res.status(404).json({ error: 'Unit not found' });
        return;
      }
      
      res.json(unit);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching unit' });
    }
  }

  async createUnit(req: Request, res: Response): Promise<void> {
    try {
      const unitData: CreateUnitRequest = req.body;
      const unit = await this.unitRepository.create(unitData);
      res.status(201).json(unit);
    } catch (error) {
      res.status(500).json({ error: 'Error creating unit' });
    }
  }

  async updateUnit(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const unitData: UpdateUnitRequest = req.body;
      const unit = await this.unitRepository.update(id, unitData);
      
      if (!unit) {
        res.status(404).json({ error: 'Unit not found' });
        return;
      }
      
      res.json(unit);
    } catch (error) {
      res.status(500).json({ error: 'Error updating unit' });
    }
  }

  async deleteUnit(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.unitRepository.delete(id);
      
      if (!success) {
        res.status(404).json({ error: 'Unit not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting unit' });
    }
  }
}