export interface Product {
  id?: number;
  productId: string;
  categoryId?: number;
  category?: string;
  productName?: string;
  unit?: string;
  basePrice?: number;
  sellingPrice?: number;
  status?: string;
}

export interface ProductDTO {
  productId: string;
  categoryId?: number;
  productName?: string;
  unit?: string;
  basePrice?: number;
  sellingPrice?: number;
}