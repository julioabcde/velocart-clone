import { BASE_URL } from '@/constants/GlobalConstant';
import { GeneralResponse, RequestStructure } from '@/models/GeneralDTO';

export class GeneralService {
  static async callApi<TData, TBody = unknown>(request: RequestStructure<TBody>, timeout = 30000) {
    const token = localStorage.getItem('token');

    const { api, method, body } = request;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const apiRequestConfig: RequestInit = {
      method,
      headers,
      ...(body && method !== 'GET' && method !== 'HEAD' ? { body: JSON.stringify(body) } : {}),
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    apiRequestConfig.signal = controller.signal;

    try {
      const response = await fetch(BASE_URL + api, apiRequestConfig);
      clearTimeout(timer);
      return (await response.json()) as GeneralResponse<TData>;
    } catch (e: unknown) {
      clearTimeout(timer);
      throw e;
    }
  }

  static async callDownloadApi(
    api: string,
    method: string = 'GET',
    timeout = 30000
  ): Promise<Blob> {
    const token = localStorage.getItem('token');

    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const apiRequestConfig: RequestInit = {
      method,
      headers,
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    apiRequestConfig.signal = controller.signal;

    try {
      const response = await fetch(BASE_URL + api, apiRequestConfig);
      clearTimeout(timer);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      return await response.blob();
    } catch (e: unknown) {
      clearTimeout(timer);
      throw e;
    }
  }
}
