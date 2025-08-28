import { DropdownOption, RequestStructure } from '@/models/GeneralDTO';
import { GeneralService } from '../GeneralService';

export class MasterService {
  static getMasterRole(search?: string) {
    let apiUrl = '/master/role';
    if (search) {
      apiUrl += `?search=${encodeURIComponent(search)}`;
    }

    const request: RequestStructure = {
      api: apiUrl,
      method: 'GET',
    };
    return GeneralService.callApi<DropdownOption[]>(request);
  }

  static getMasterCategory(search?: string) {
    let apiUrl = '/master/category';
    if (search) {
      apiUrl += `?search=${encodeURIComponent(search)}`;
    }

    const request: RequestStructure = {
      api: apiUrl,
      method: 'GET',
    };
    return GeneralService.callApi<DropdownOption[]>(request);
  }
}
