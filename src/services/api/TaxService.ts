import { PaginatedData, PaginationParam, RequestStructure } from '@/models/GeneralDTO';
import { GeneralService } from '../GeneralService';
import { taxAdapter } from '@/models/Tax';

export class TaxService {
  static getAllTaxPagination(param: PaginationParam) {
    const request: RequestStructure<PaginationParam> = {
      api: '/tax/list',
      method: 'POST',
      body: param,
    };
    return GeneralService.callApi<PaginatedData<taxAdapter>>(request);
  }

  static getTaxById(param: { id: number }) {
    const request: RequestStructure<{ id: number }> = {
      api: '/tax/detail',
      method: 'POST',
      body: param,
    };
    return GeneralService.callApi<taxAdapter>(request);
  }

  static createTax(param: taxAdapter) {
    const request: RequestStructure<taxAdapter> = {
      api: '/tax/create',
      method: 'POST',
      body: param,
    };
    return GeneralService.callApi<taxAdapter>(request);
  }

  static updateTax(param: taxAdapter) {
    const request: RequestStructure<taxAdapter> = {
      api: '/tax/update',
      method: 'PUT',
      body: param,
    };
    return GeneralService.callApi<taxAdapter>(request);
  }

  static deleteTax(param: { id: number }) {
    const request: RequestStructure<{ id: number }> = {
      api: '/tax/delete',
      method: 'DELETE',
      body: param,
    };
    return GeneralService.callApi(request);
  }
}
