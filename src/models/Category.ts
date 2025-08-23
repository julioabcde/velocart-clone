export interface Category {
    id: number;
    categoryName?: string;
    status?: string;
}

export interface CreateCategoryDTO {
    categoryName?: string;
}

export interface EditCategoryDTO {
    id: number;
    categoryName?: string;
}

export interface CategoryByIdDTO {
    id: number;
}