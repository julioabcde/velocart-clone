import {
  PaginatedData,
  PaginationParam,
  RequestStructure,
} from "@/models/GeneralDTO";
import { fetchData } from "../GeneralService";
import { Product, ProductDTO } from "@/models/Product";

export class ProductService {

  static getAllProducts(params: any) {
    const request: RequestStructure<PaginationParam> = {
      api: "/get-all-products",
      method: "POST",
      body: params,
    };
    return fetchData<PaginatedData<Product>>(request);
  }

  static getProductById(productId: string){
    const request: RequestStructure<{ productId: string }> = {
      api: "/get-product-by-product-id",
      method: "POST",
      body: { productId },
    };
    return fetchData<Product>(request);
  }

  static createProduct(payload: {
    productId: string;
    categoryId: number;
    productName: string;
    unit: string;
    basePrice: number;
    sellingPrice: number;
  }) {
    const request: RequestStructure<typeof payload> = {
      api: "/save-new-product",
      method: "POST",
      body: payload,
    };
    return fetchData(request);
  }

  static updateProduct(payload: ProductDTO) {
    const request: RequestStructure<ProductDTO> = {
      api: "/update-product",
      method: "PUT",
      body: payload,
    };
    return fetchData(request);
  }

  static deleteProduct(id: any) {
    const req: RequestStructure<any> = {
      api: "/products/${id}",
      method: "PATCH",
      body: null,
    };
    return fetchData(req);
  }
}
