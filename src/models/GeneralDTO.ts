export interface PaginationParam {
  pagination?: boolean;
  perPage?: number;
  page?: number;
  query?: string;
  filter?: string;
}

export interface RequestStructure<TBody = undefined> {
  api: string;
  method?: string;
  body?: TBody;
  headers?: HeadersInit;
}

export interface PaginatedData<TList> {
  data: TList[];
  total: number;
}

export interface GeneralResponse<TData> {
  responseDate: string,
  responseCode: string,
  responseDesc: string,
  message: string,
  data: TData
}

export interface DropdownOption {
  value: string | number,
  label: string
}