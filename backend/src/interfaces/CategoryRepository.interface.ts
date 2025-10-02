import type {CategoryI} from "./Category.interface.ts";


export interface CategoryRepositoryInterface {
    getAll(): Promise<CategoryI[]>,
    create(data : Partial<CategoryI>):Promise<CategoryI>,
    update(id : number ,data : Partial<CategoryI>):Promise<CategoryI>,
    delete(id: number) : Promise<CategoryI>,
}