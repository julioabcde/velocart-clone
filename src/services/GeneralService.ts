import { BASE_URL } from "@/constants/GlobalConstant";
import { RequestStructure } from "@/models/GeneralDTO";

const defaultHeader: HeadersInit = {
  "Content-Type": "application/json",
  // 'Authorization': 'Bearer YOUR_TOKEN_HERE', // optional
};

export async function fetchData<TResponse, TBody = unknown> (structure: RequestStructure<TBody>): Promise<TResponse> {
  const { api, method, body, headers = defaultHeader } = structure;

  const response = await fetch(BASE_URL + api, { method, headers, body: body ? JSON.stringify(body) : undefined, });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Fetch error: ${response.status} - ${errorText}`);
  }

  return response.json();
}
