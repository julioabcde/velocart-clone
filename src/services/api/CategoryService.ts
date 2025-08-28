import { Category, CategoryByIdDTO, CreateCategoryDTO, EditCategoryDTO } from "@/models/Category";
import { PaginatedData, PaginationParam, RequestStructure } from "@/models/GeneralDTO";
import { GeneralService } from "../GeneralService";

export class CategoryService {
  static getAllCategoriesPagination(param: PaginationParam) {
    const request: RequestStructure<PaginationParam> = {
      api: "/category/list",
      method: "POST",
      body: param,
    };
    return GeneralService.callApi<PaginatedData<Category>>(request);
  }

  static getAllCategories(param: PaginationParam) {
    const request: RequestStructure<PaginationParam> = {
      api: "/category/list",
      method: "POST",
      body: param,
    };
    return GeneralService.callApi<Category[]>(request);
  }

  static getCategoryById(param: CategoryByIdDTO) {
    const request: RequestStructure<CategoryByIdDTO> = {
      api: "/category/detail",
      method: "POST",
      body: param,
    };
    return GeneralService.callApi<Category>(request);
  }

  static createCategory(param: CreateCategoryDTO) {
    const request: RequestStructure<CreateCategoryDTO> = {
      api: "/category/create",
      method: "POST",
      body: param,
    }
    return GeneralService.callApi<Category>(request);
  }

  static updateCategory(param: EditCategoryDTO) {
    const request: RequestStructure<EditCategoryDTO> = {
      api: "/category/update",
      method: "PUT",
      body: param,
    }
    return GeneralService.callApi<Category>(request);
  }

  static deleteCategory(param: CategoryByIdDTO) {
    const request: RequestStructure<CategoryByIdDTO> = {
      api: "/category/delete",
      method: "PATCH",
      body: param,
    }
    return GeneralService.callApi(request);
  }
}