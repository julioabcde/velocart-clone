export interface Tax {
    id: number;
    taxName?: string;
    taxPercentage?: number;
    status?: string;
}

export interface taxAdapter {
    id: number;
    tax_name?: string;
    tax_percentage?: number;
    status?: string;
}