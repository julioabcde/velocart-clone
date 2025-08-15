import { PaginatedData, PaginationParam, RequestStructure } from "@/models/GeneralDTO";
import { GeneralService } from "../GeneralService";
import { Staff } from "@/models/Staff";

export class StaffService {
   static getAllStaffsPagination(param: PaginationParam) {
       const request: RequestStructure<PaginationParam> = {
         api: "/get-all-staffs",
         method: "POST",
         body: param,
       };
       return GeneralService.fetchData<PaginatedData<Staff>>(request);
     }
}