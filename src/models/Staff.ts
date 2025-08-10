export interface Staff {
  id?: number;
  staffId?: string;
  staffName?: string;
  roleName?: string;
  status?: string;
}

export interface Credential {
  staffId?: string;
  role?: string;
  token?: string;
  tokenType?: string;
  expiresIn?: number;
}

export interface LoginDTO {
  staffId?: string;
  password?: string;
}
