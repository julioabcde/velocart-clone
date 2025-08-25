import { PaginatedData, PaginationParam, RequestStructure } from "@/models/GeneralDTO";
import { GeneralService } from "../GeneralService";
import { CreateEditSupplierDTO, EditSupplierDTO, Supplier } from "@/models/Supplier";


export class SupplierService {
    static getAllSupplierPagination(param: PaginationParam) {
        const request: RequestStructure<PaginationParam> = {
            api: "/supplier/list",
            method: "POST",
            body: param,
        };
        return GeneralService.callApi<PaginatedData<Supplier>>(request);
    };

    static getSupplierBySupplierId(supplierId: number) {
        const request: RequestStructure<{ supplierId: number}> = {
            api: "/supplier/detail",
            method: "POST",
            body: { supplierId},
        };

        return GeneralService.callApi<Supplier>(request);
    }

    static createSupplier(param: CreateEditSupplierDTO) {
        const request: RequestStructure<CreateEditSupplierDTO> = {
            api: "/supplier/create",
            method: "POST",
            body: param,
        };
        return GeneralService.callApi<Supplier>(request);
    }

    static updateSupplier(param: EditSupplierDTO) {
        const request: RequestStructure<EditSupplierDTO> = {
            api: "/supplier/update",
            method: "PUT",
            body: param,
        };
        return GeneralService.callApi<Supplier>(request);
    }

    static deleteSupplier(id: number) {
        const request: RequestStructure<{ id: number}> = {
            api: "/supplier/delete",
            method: "PATCH",
            body: { id},
        };

        return GeneralService.callApi<{ success: boolean}>(request);
    }
}