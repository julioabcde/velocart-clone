import { RequestStructure } from '@/models/GeneralDTO';
import { CreateIncomingStockDTO } from '@/models/Stock';
import { GeneralService } from '../GeneralService';
import { Product } from '@/models/Product';

export class StockService {
  static createStock(param: CreateIncomingStockDTO[]) {
    const request: RequestStructure<{ stocks: CreateIncomingStockDTO[] }> = {
      api: '/stock/incoming/create',
      method: 'POST',
      body: { stocks: param },
    };
    return GeneralService.callApi<Product[]>(request);
  }
}
