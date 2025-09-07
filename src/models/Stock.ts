export interface Stock {
  supplierId?: number;
  productId: string;
  action: string;
  invoiceDate: Date;
  receivedDate: Date;
  currentStock: number;
  newStock: number;
  totalStock: number;
  notes: string;
}

export interface IncomingStock {
  supplierId: number;
  supplierName: string;
  productId: string;
  productName: string;
  invoiceDate: string;
  receivedDate: string;
  currentStock: number;
  incomingStock: number;
  notes: string;
}

export interface CreateIncomingStockDTO {
  supplierId?: number;
  productId: string;
  invoiceDate: string;
  receivedDate: string;
  incomingStock: number;
  notes: string;
}

export interface OutgoingStock {
  productId: string;
  productName: string;
  invoiceDate: string;
  deliveryDate: string;
  currentStock: number;
  outgoingStock: number;
  notes: string;
}
