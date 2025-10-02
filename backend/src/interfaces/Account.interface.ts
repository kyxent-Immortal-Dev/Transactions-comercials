export interface AccountsInterface {
  id: number;
  name: string;
  lastname: string;
  email: string;
  password: string;
  image: string;
}

export interface AccountRepositoryInterface {
  getAll(): Promise<AccountsInterface[]>;
  create(data: Partial<AccountsInterface>): Promise<AccountsInterface>;
  update(
    id: number,
    data: Partial<AccountsInterface>
  ): Promise<AccountsInterface>;
  delete(id: number): Promise<AccountsInterface>;
}
