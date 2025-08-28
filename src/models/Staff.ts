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
  ttl?: number;
}

export interface LoginDTO {
  staffId?: string;
  password?: string;
}

export interface CreateStaffDTO {
  staffName: string;
  password: string;
  role: number;
};

export interface EditStaffDTO {
  staffId: string;
  staffName: string;
  password: string;
  role: number;
};

export interface StaffByStaffIdDTO {
  staffId: string;
}
