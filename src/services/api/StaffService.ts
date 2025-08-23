import { PaginatedData, PaginationParam, RequestStructure } from "@/models/GeneralDTO";
import { GeneralService } from "../GeneralService";
import { CreateStaffDTO, Staff } from "@/models/Staff";

export class StaffService {
  static getAllStaffsPagination(param: PaginationParam) {
    const request: RequestStructure<PaginationParam> = {
      api: "/get-all-staffs",
      method: "POST",
      body: param,
    };
    return GeneralService.fetchData<PaginatedData<Staff>>(request);
  }

  static getStaffByStaffId(staffId: string) {
    const request: RequestStructure<{ staffId: string }> = {
      api: "/get-staff-by-staff-id",
      method: "POST",
      body: { staffId },
    };
    return GeneralService.fetchData<Staff>(request);
  }

  static saveNewStaff(param: CreateStaffDTO) {
    const request: RequestStructure<CreateStaffDTO> = {
      api: "/save-new-staff",
      method: "POST",
      body: param,
    };
    return GeneralService.fetchData<Staff>(request);
  }

  static updateStaff(param: Partial<Staff>) {
    const request: RequestStructure<Partial<Staff>> = {
      api: "/update-staff",
      method: "PUT",
      body: param,
    };
    return GeneralService.fetchData<Staff>(request);
  }

  static deleteStaff(staffId: string) {
    const request: RequestStructure<{ staffId: string }> = {
      api: "/delete-staff",
      method: "PATCH",
      body: { staffId },
    };
    return GeneralService.fetchData<{ success: boolean }>(request);
  }
}