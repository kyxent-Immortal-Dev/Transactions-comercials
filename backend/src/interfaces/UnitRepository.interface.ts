import { Unit, CreateUnitRequest, UpdateUnitRequest } from "./Unit.interface";

export interface UnitRepositoryInterface {
  create(data: CreateUnitRequest): Promise<Unit>;
  findAll(): Promise<Unit[]>;
  findById(id: number): Promise<Unit | null>;
  update(id: number, data: UpdateUnitRequest): Promise<Unit | null>;
  delete(id: number): Promise<boolean>;
}