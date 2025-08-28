import { PaginatedData, PaginationParam, RequestStructure } from "@/models/GeneralDTO";
import { GeneralService } from "../GeneralService";
import { CreateStaffDTO, EditStaffDTO, Staff, StaffByStaffIdDTO } from "@/models/Staff";

export class StaffService {
  static getAllStaffsPagination(param: PaginationParam) {
    const request: RequestStructure<PaginationParam> = {
      api: "/staff/list",
      method: "POST",
      body: param,
    };
    return GeneralService.callApi<PaginatedData<Staff>>(request);
  }

  static getStaffByStaffId(param: StaffByStaffIdDTO) {
    const request: RequestStructure<StaffByStaffIdDTO> = {
      api: "/staff/detail",
      method: "POST",
      body: param,
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

  static updateStaff(param: EditStaffDTO) {
    const request: RequestStructure<EditStaffDTO> = {
      api: "/staff/update",
      method: "PUT",
      body: param,
    };
    return GeneralService.callApi(request);
  }

  static deleteStaff(param: StaffByStaffIdDTO) {
    const request: RequestStructure<StaffByStaffIdDTO> = {
      api: "/staff/delete",
      method: "PATCH",
      body: param,
    };
    return GeneralService.callApi(request);
  }
}