"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SUCCESS_CODE } from "@/constants/GlobalConstant";
import { ProductByIdDTO, Product } from "@/models/Product";
import { ProductService } from "@/services/api/ProductService";
import EditProductForm from "./EditProductForm";

export default function ViewEditProduct() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const getProductByIdParam: ProductByIdDTO = {
    productId: productId
  };

  const getProductById = async () => {
    try {
      const response = await ProductService.getProductById(getProductByIdParam);
      if (response.responseCode !== SUCCESS_CODE) {
        console.log("responseDate: ", response.responseDate);
        console.log("responseCode: ", response.responseCode);
        console.log("responseDesc: ", response.responseDesc);
        console.log("message: ", response.message);

        setError(true);
      }
      else {
        setProduct(response.data);
      }
    }
    catch (err) {
      setError(true);
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProductById();
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <EditProductForm data={product} />
  );
}
