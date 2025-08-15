export interface Credential {
  staff_id?: string;
  role?: number;
  token?: string;
  ttl?: number;
}

export interface LoginDTO {
  staffId?: string;
  password?: string;
}
