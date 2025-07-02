import type { ApiSuccessResponse, ApiErrorResponse } from './common';
import {
  ERROR_NOTFOUND_MESSAGE_CODE,
  ERROR_UNAUTHORIZED_MESSAGE_CODE,
  ERROR_AUTH_MESSAGE_CODE,
} from './error-code';

export interface LoginRequest {
  name: string; // 用户名
  password: string; // 用户密码
}

export interface LoginData {
  id: string;
  name: string;
  password: string;
  email: string | null;
  status: string;
  userRole: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  operatedBy: string;
  accessToken: string;
}

export type LoginSuccessResponse = ApiSuccessResponse<LoginData>;

export interface LoginErrorResponse extends ApiErrorResponse {
  msg:
    | ERROR_NOTFOUND_MESSAGE_CODE.NOT_FOUND
    | ERROR_UNAUTHORIZED_MESSAGE_CODE.UNAUTHORIZED
    | ERROR_AUTH_MESSAGE_CODE.STATUS_ERROR
    | ERROR_AUTH_MESSAGE_CODE.LOCKED;
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse; 