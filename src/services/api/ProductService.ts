import { PaginatedData, PaginationParam, RequestStructure } from "@/models/GeneralDTO";
import { CreateEditProductDTO, Product, ProductByProductIdDTO } from "@/models/Product";
import { GeneralService } from "../GeneralService";

export class ProductService {
  static getAllProductsPagination(param: PaginationParam) {
    const request: RequestStructure<PaginationParam> = {
      api: "/product/list",
      method: "POST",
      body: param,
    };
    return GeneralService.callApi<PaginatedData<Product>>(request);
  }

  static getAllProducts(param: PaginationParam) {
    const request: RequestStructure<PaginationParam> = {
      api: "/product/list",
      method: "POST",
      body: param,
    };
    return GeneralService.callApi<Product[]>(request);
  }

  static getProductByProductId(param: ProductByProductIdDTO) {
    const request: RequestStructure<ProductByProductIdDTO> = {
      api: "/product/detail",
      method: "POST",
      body: param,
    };
    return GeneralService.callApi<Product>(request);
  }

  static createProduct(param: CreateEditProductDTO) {
    const request: RequestStructure<CreateEditProductDTO> = {
      api: "/product/create",
      method: "POST",
      body: param,
    };
    return GeneralService.callApi<Product>(request);
  }

  static updateProduct(param: CreateEditProductDTO) {
    const request: RequestStructure<CreateEditProductDTO> = {
      api: "/product/update",
      method: "PUT",
      body: param,
    };
    return GeneralService.callApi(request);
  }

  static deleteProduct(param: ProductByProductIdDTO) {
    const request: RequestStructure<any> = {
      api: "/product/delete",
      method: "PATCH",
      body: param,
    };
    return GeneralService.callApi(request);
  }
}
