export interface Product {
  id?: number;
  product_id?: string;
  category_id?: number;
  product_name?: string;
  unit?: string;
  base_price?: number;
  selling_price?: number;
  status?: number;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

export interface ProductDTO {
  productId?: string;
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

export interface ProductByIdDTO {
  productId: string;
}