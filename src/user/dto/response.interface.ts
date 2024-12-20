export interface UserDeleteResponse {
  message: string;
}

export interface UserFindOneResponse {
  id?: number;
  nama: string;
  username: string;
  role: string;
  email: string;
  created_at?: Date;
  updated_at?: Date | null; // NULLABLE FIELD
  deleted_at?: Date | null; // NULLABLE FIELD
}

export interface UserFindAllResponseData extends UserFindOneResponse {}

export interface UserFindAllResponse {
  page: number;
  per_page: number;
  data: UserFindAllResponseData[];
  total_page: number;
}
