import { Request, Response } from 'express';
import { QuoteRepositoryImpl } from '../repositories/Quote.repository';
import { CreateQuoteRequest, UpdateQuoteRequest, CreateQuoteDetailRequest, UpdateQuoteDetailRequest } from '../interfaces/Quote.interface';

export class QuoteController {
  private quoteRepository: QuoteRepositoryImpl;

  constructor() {
    this.quoteRepository = new QuoteRepositoryImpl();
  }

  async getAllQuotes(req: Request, res: Response): Promise<void> {
    try {
      const quotes = await this.quoteRepository.findAll();
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching quotes' });
    }
  }

  async getQuoteById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const quote = await this.quoteRepository.findById(id);
      
      if (!quote) {
        res.status(404).json({ error: 'Quote not found' });
        return;
      }
      
      res.json(quote);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching quote' });
    }
  }

  async getQuotesBySupplierId(req: Request, res: Response): Promise<void> {
    try {
      const supplierId = parseInt(req.params.supplierId);
      const quotes = await this.quoteRepository.findBySupplierId(supplierId);
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching quotes' });
    }
  }

  async createQuote(req: Request, res: Response): Promise<void> {
    try {
      const quoteData: CreateQuoteRequest = req.body;
      const quote = await this.quoteRepository.create(quoteData);
      res.status(201).json(quote);
    } catch (error) {
      res.status(500).json({ error: 'Error creating quote' });
    }
  }

  async updateQuote(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const quoteData: UpdateQuoteRequest = req.body;
      const quote = await this.quoteRepository.update(id, quoteData);
      
      if (!quote) {
        res.status(404).json({ error: 'Quote not found' });
        return;
      }
      
      res.json(quote);
    } catch (error) {
      res.status(500).json({ error: 'Error updating quote' });
    }
  }

  async deleteQuote(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.quoteRepository.delete(id);
      
      if (!success) {
        res.status(404).json({ error: 'Quote not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting quote' });
    }
  }

  // Quote Details endpoints
  async createQuoteDetail(req: Request, res: Response): Promise<void> {
    try {
      const detailData: CreateQuoteDetailRequest = req.body;
      const detail = await this.quoteRepository.createDetail(detailData);
      res.status(201).json(detail);
    } catch (error) {
      res.status(500).json({ error: 'Error creating quote detail' });
    }
  }

  async getQuoteDetailsByQuoteId(req: Request, res: Response): Promise<void> {
    try {
      const quoteId = parseInt(req.params.quoteId);
      const details = await this.quoteRepository.findDetailsByQuoteId(quoteId);
      res.json(details);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching quote details' });
    }
  }

  async getQuoteDetailById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const detail = await this.quoteRepository.findDetailById(id);
      
      if (!detail) {
        res.status(404).json({ error: 'Quote detail not found' });
        return;
      }
      
      res.json(detail);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching quote detail' });
    }
  }

  async updateQuoteDetail(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const detailData: UpdateQuoteDetailRequest = req.body;
      const detail = await this.quoteRepository.updateDetail(id, detailData);
      
      if (!detail) {
        res.status(404).json({ error: 'Quote detail not found' });
        return;
      }
      
      res.json(detail);
    } catch (error) {
      res.status(500).json({ error: 'Error updating quote detail' });
    }
  }

  async deleteQuoteDetail(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.quoteRepository.deleteDetail(id);
      
      if (!success) {
        res.status(404).json({ error: 'Quote detail not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting quote detail' });
    }
  }
}