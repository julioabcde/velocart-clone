export interface Product {
  id?: number;
  productId: string;
  categoryId?: number;
  categoryName?: string;
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

export interface CreateEditProductDTO {
  productId: string;
  categoryId: number;
  productName: string;
  unit: string;
  basePrice: number;
  sellingPrice: number;
}

export interface EditProductDTO {
  id: number;
  productId: string;
  categoryId: number;
  productName: string;
  unit: string;
  basePrice: number;
  sellingPrice: number;
}

export interface ProductByProductIdDTO {
  productId: string;
}