export interface Category {
    id: number;
    categoryName?: string;
    status?: string;
}

export interface CategoryDTO {
    id: number;
    categoryName?: string;
}

export interface CategoryByIdDTO {
    id: number;
}