import { PaginatedData, PaginationParam, RequestStructure } from "@/models/GeneralDTO";
import { GeneralService } from "../GeneralService";
import { CreateStaffDTO, Staff } from "@/models/Staff";

export class StaffService {
  static getAllStaffsPagination(param: PaginationParam) {
    const request: RequestStructure<PaginationParam> = {
      api: "/staff/list",
      method: "POST",
      body: param,
    };
    return GeneralService.callApi<PaginatedData<Staff>>(request);
  }

  static getStaffByStaffId(staffId: string) {
    const request: RequestStructure<{ staffId: string }> = {
      api: "/staff/detail",
      method: "POST",
      body: { staffId },
    };
    return GeneralService.callApi<Staff>(request);
  }

  static createStaff(param: CreateStaffDTO) {
    const request: RequestStructure<CreateStaffDTO> = {
      api: "/staff/create",
      method: "POST",
      body: param,
    };
    return GeneralService.callApi<Staff>(request);
  }

  static updateStaff(param: Partial<Staff>) {
    const request: RequestStructure<Partial<Staff>> = {
      api: "/staff/update",
      method: "PUT",
      body: param,
    };
    return GeneralService.callApi<Staff>(request);
  }

  static deleteStaff(staffId: string) {
    const request: RequestStructure<{ staffId: string }> = {
      api: "/staff/delete",
      method: "PATCH",
      body: { staffId },
    };
    return GeneralService.callApi<{ success: boolean }>(request);
  }
}