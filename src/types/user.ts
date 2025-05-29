export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtResponse {
  token: string;
}

export interface SignupRequest {
  username: string;
  password: string;
}
