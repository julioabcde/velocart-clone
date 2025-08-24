import { Category, CategoryByIdDTO, CreateCategoryDTO, EditCategoryDTO } from "@/models/Category";
import { PaginatedData, PaginationParam, RequestStructure } from "@/models/GeneralDTO";
import { GeneralService } from "../GeneralService";

export class CategoryService {
  static getAllCategoriesPagination(param: PaginationParam) {
    const request: RequestStructure<PaginationParam> = {
      api: "/get-all-categories",
      method: "POST",
      body: param,
    };
    return GeneralService.callApi<PaginatedData<Category>>(request);
  }

  static getAllCategories(param: PaginationParam) {
    const request: RequestStructure<PaginationParam> = {
      api: "/get-all-categories",
      method: "POST",
      body: param,
    };
    return GeneralService.callApi<Category[]>(request);
  }

  static getCategoryById(param: CategoryByIdDTO) {
    const request: RequestStructure<CategoryByIdDTO> = {
      api: "/get-category-by-id",
      method: "POST",
      body: param,
    };
    return GeneralService.callApi<Category>(request);
  }

  static createCategory(param: CreateCategoryDTO) {
    const request: RequestStructure<CreateCategoryDTO> = {
      api: "/save-new-category",
      method: "POST",
      body: param,
    }
    return GeneralService.callApi<Category>(request);
  }

  static updateCategory(param: EditCategoryDTO) {
    const request: RequestStructure<EditCategoryDTO> = {
      api: "/update-category",
      method: "PUT",
      body: param,
    }
    return GeneralService.callApi<Category>(request);
  }

  static deleteCategory(param: CategoryByIdDTO) {
    const request: RequestStructure<CategoryByIdDTO> = {
      api: "/delete-category",
      method: "PATCH",
      body: param,
    }
    return GeneralService.callApi(request);
  }
}