import { DropdownOption } from "./GeneralDTO";

export interface Product {
  id?: number;
  productId: string;
  categoryId?: number;
  categoryName?: string;
  productName?: string;
  unit?: string;
  basePrice?: number;
  sellingPrice?: number;
  suppliers?: DropdownOption[];
  status?: string;
}

export interface CreateEditProductDTO {
  productId: string;
  categoryId: number;
  productName: string;
  unit: string;
  basePrice: number;
  sellingPrice: number;
  suppliers?: number[];
}

export interface EditProductDTO {
  id: number;
  productId: string;
  categoryId: number;
  productName: string;
  unit: string;
  basePrice: number;
  sellingPrice: number;
  suppliers?: DropdownOption[];
}

export interface ProductByProductIdDTO {
  productId: string;
}