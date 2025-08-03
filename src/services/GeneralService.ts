import { BASE_URL } from "@/constants/GlobalConstant";
import { GeneralResponse, RequestStructure } from "@/models/GeneralDTO";

export async function fetchData<TData, TBody = unknown> (request: RequestStructure<TBody>): Promise<GeneralResponse<TData>> {
  const { api, method, body, headers } = request;

  const token = typeof window !== "undefined" ? localStorage.getItem("jwt_token") : null;

  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(BASE_URL + api, { method, headers: finalHeaders, body: body ? JSON.stringify(body) : undefined, });

  return response.json();
}
