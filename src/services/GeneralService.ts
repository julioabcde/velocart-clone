import { BASE_URL } from "@/constants/GlobalConstant";
import { GeneralResponse, RequestStructure } from "@/models/GeneralDTO";
import { getTokenOrRedirect } from "./AuthService";

export async function fetchData<TData, TBody = unknown> (request: RequestStructure<TBody>): Promise<GeneralResponse<TData>> {
  const { api, method, body } = request;

  const token = getTokenOrRedirect();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(BASE_URL + api, { method, headers: headers, body: body ? JSON.stringify(body) : undefined, });

  return response.json();
}
