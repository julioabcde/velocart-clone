export interface Supplier {
  id?: number;
  supplierName: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: string;
}

export interface SupplierDTO {
  supplierName: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface CreateSupplierDTO {
  supplierName: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface EditSupplierDTO {
  id: number;
  supplierName: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface SupplierByIdDTO {
  id: number;
}
