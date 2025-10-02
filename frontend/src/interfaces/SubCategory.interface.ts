export interface ResponseSubCategory {
    msj:  string;
    data: SubCategory[];
}

export interface SubCategory {
    id:          number;
    name:        string;
    description: string;
    categoryid:  number;
}
