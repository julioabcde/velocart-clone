export interface CreateStockDTO {
  productId: string;
  supplierId: number;
  action: string;
  invoiceDate: Date;
  receivedDate: Date;
  previousStock: number;
  newStock: number;
  notes: string;
}
