import { Category } from "@/models/Category";
import { PaginatedData, PaginationParam, RequestStructure } from "@/models/GeneralDTO";
import { GeneralService } from "../GeneralService";

export class CategoryService {
  static getAllCategoriesPagination(param: PaginationParam) {
    const request: RequestStructure<PaginationParam> = {
      api: "/get-all-categories",
      method: "POST",
      body: param,
    };
    return GeneralService.fetchData<PaginatedData<Category>>(request);
  }

  static getAllCategories(param: PaginationParam) {
    const request: RequestStructure<PaginationParam> = {
      api: "/get-all-categories",
      method: "POST",
      body: param,
    };
    return GeneralService.fetchData<Category[]>(request);
  }
}