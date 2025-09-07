import { PaginatedData, PaginationParam, RequestStructure } from '@/models/GeneralDTO';
import { GeneralService } from '../GeneralService';
import { CreateSupplierDTO, EditSupplierDTO, Supplier, SupplierByIdDTO } from '@/models/Supplier';

export class SupplierService {
  static getAllSupplierPagination(param: PaginationParam) {
    const request: RequestStructure<PaginationParam> = {
      api: '/supplier/list',
      method: 'POST',
      body: param,
    };
    return GeneralService.callApi<PaginatedData<Supplier>>(request);
  }

  static getSupplierById(param: SupplierByIdDTO) {
    const request: RequestStructure<SupplierByIdDTO> = {
      api: '/supplier/detail',
      method: 'POST',
      body: param,
    };

    return GeneralService.callApi<Supplier>(request);
  }

  static createSupplier(param: CreateSupplierDTO) {
    const request: RequestStructure<CreateSupplierDTO> = {
      api: '/supplier/create',
      method: 'POST',
      body: param,
    };
    return GeneralService.callApi<Supplier>(request);
  }

  static updateSupplier(param: EditSupplierDTO) {
    const request: RequestStructure<EditSupplierDTO> = {
      api: '/supplier/update',
      method: 'PUT',
      body: param,
    };
    return GeneralService.callApi(request);
  }

  static deleteSupplier(param: SupplierByIdDTO) {
    const request: RequestStructure<SupplierByIdDTO> = {
      api: '/supplier/delete',
      method: 'PATCH',
      body: param,
    };
    return GeneralService.callApi(request);
  }
}
