import { PaginatedData, PaginationParam, RequestStructure } from '@/models/GeneralDTO';
import { GeneralService } from '../GeneralService';
import { Product } from '@/models/Product';
import { CreateStockDTO, EditStockDTO, Stock, StockByIdDTO } from '@/models/Stock';
import { HTTPMethod } from '@/enum/GlobalEnum';

export class StockService {
  static getAllStocksPagination(param: PaginationParam) {
    const request: RequestStructure<PaginationParam> = {
      api: '/stock/list',
      method: HTTPMethod.POST,
      body: param,
    };
    return GeneralService.callApi<PaginatedData<Stock>>(request);
  }

  static getStockById(param: StockByIdDTO) {
    const request: RequestStructure<StockByIdDTO> = {
      api: '/stock/detail',
      method: HTTPMethod.POST,
      body: param,
    };
    return GeneralService.callApi<Stock>(request);
  }

  static createStock(param: CreateStockDTO) {
    const request: RequestStructure<CreateStockDTO> = {
      api: '/stock/create',
      method: HTTPMethod.POST,
      body: param,
    };
    return GeneralService.callApi<Product[]>(request);
  }

  static updateStock(param: EditStockDTO) {
    const request: RequestStructure<EditStockDTO> = {
      api: '/stock/update',
      method: HTTPMethod.PUT,
      body: param,
    };
    return GeneralService.callApi<Product[]>(request);
  }
}
