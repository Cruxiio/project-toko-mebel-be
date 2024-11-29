export interface TokenPayload {
  id: number;
  username: string;
  role: string;
}

export interface loginResponse {
  message: string;
  accessToken: string;
  role: string;
}
