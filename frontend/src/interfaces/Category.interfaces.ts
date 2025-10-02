export interface ResponseCategory {
    msj:  string;
    data: CategoryI[];
}

export interface CategoryI {
    id:          number;
    name:        string;
    description: string;
}
