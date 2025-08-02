export interface GeneralParam {
  pagination?: boolean;
  perPage?: number;
  page?: number;
  query?: string;
  filter?: string;
}

export interface RequestStructure<TBody> {
  api: string;
  method?: string;
  body?: TBody;
  headers?: HeadersInit;
}

export interface PaginatedData<TResponse> {
    data: {
        data: TResponse[],
        total: number
    }
}