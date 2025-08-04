export interface Credential {
  staff_id?: string;
  role?: number;
  token?: string;
  token_type?: string;
  expires_in?: string;
}

export interface LoginDTO {
  staffId?: string;
  password?: string;
}
