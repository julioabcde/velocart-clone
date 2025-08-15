import { PaginatedData, PaginationParam, RequestStructure } from "@/models/GeneralDTO";
import { CreateEditProductDTO, Product, ProductByIdDTO, ProductDTO } from "@/models/Product";
import { GeneralService } from "../GeneralService";

export class ProductService {
  static getAllProductsPagination(param: PaginationParam) {
    const request: RequestStructure<PaginationParam> = {
      api: "/get-all-products",
      method: "POST",
      body: param,
    };
    return GeneralService.fetchData<PaginatedData<Product>>(request);
  }

  static getAllProducts(param: PaginationParam) {
    const request: RequestStructure<PaginationParam> = {
      api: "/get-all-products",
      method: "POST",
      body: param,
    };
    return GeneralService.fetchData<Product[]>(request);
  }

  static getProductById(param: ProductByIdDTO) {
    const request: RequestStructure<ProductByIdDTO> = {
      api: "/get-product-by-product-id",
      method: "POST",
      body: param,
    };
    return GeneralService.fetchData<Product>(request);
  }

  static createProduct(param: CreateEditProductDTO) {
    const request: RequestStructure<CreateEditProductDTO> = {
      api: "/save-new-product",
      method: "POST",
      body: param,
    };
    return GeneralService.fetchData<Product>(request);
  }

  static updateProduct(param: CreateEditProductDTO) {
    const request: RequestStructure<CreateEditProductDTO> = {
      api: "/update-product",
      method: "PUT",
      body: param,
    };
    return GeneralService.fetchData(request);
  }

  static deleteProduct(param: ProductByIdDTO) {
    const request: RequestStructure<any> = {
      api: "/delete-product",
      method: "PATCH",
      body: param,
    };
    return GeneralService.fetchData(request);
  }
}
