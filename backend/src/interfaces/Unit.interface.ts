export interface Unit {
  id?: number;
  name?: string;
  type?: string;
}

export interface CreateUnitRequest {
  name?: string;
  type?: string;
}

export interface UpdateUnitRequest {
  name?: string;
  type?: string;
}