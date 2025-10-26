export interface Stock {
  id: number;
  productId?: string;
  productName?: string;
  supplierId?: number;
  supplierName?: string;
  action?: string;
  flow?: string;
  invoiceNo?: string;
  invoiceDate?: string;
  transactionDate?: string;
  currentStock?: number;
  stock?: number;
  unit?: string;
  notes?: string;
  disabledFlag?: string;
}
export interface StockForm {
  supplierId: number;
  supplierName: string;
  productId: string;
  productName: string;
  invoiceNo?: string;
  invoiceDate: string;
  transactionDate: string;
  currentStock: number;
  newStock: number;
  notes: string;
}

export interface StockDTO {
  supplierId: number;
  productId: string;
  invoiceNo?: string;
  invoiceDate: string;
  transactionDate: string;
  newStock: number;
  notes: string;
}

export interface CreateStockDTO {
  action: string;
  stocks: StockDTO[];
}

export interface StockByIdDTO {
  id: number;
}

export interface EditStockDTO {
  action: string;
  id: number;
  supplierId: number;
  productId: string;
  invoiceNo?: string;
  invoiceDate: string;
  transactionDate: string;
  newStock: number;
  notes: string;
}