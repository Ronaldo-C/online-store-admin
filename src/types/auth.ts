import type { ApiSuccessResponse, ApiErrorResponse } from './common'
import {
  ERROR_NOTFOUND_MESSAGE_CODE,
  ERROR_UNAUTHORIZED_MESSAGE_CODE,
  ERROR_AUTH_MESSAGE_CODE,
} from '../constans/error-code'
import { UserData } from './user'

export interface LoginRequest {
  name: string // 用户名
  password: string // 用户密码
}

export interface LoginData extends UserData {
  accessToken: string
}

export type LoginSuccessResponse = ApiSuccessResponse<LoginData>

export interface LoginErrorResponse extends ApiErrorResponse {
  msg:
    | ERROR_NOTFOUND_MESSAGE_CODE.NOT_FOUND
    | ERROR_UNAUTHORIZED_MESSAGE_CODE.UNAUTHORIZED
    | ERROR_AUTH_MESSAGE_CODE.STATUS_ERROR
    | ERROR_AUTH_MESSAGE_CODE.LOCKED
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse

export type UserResponse = ApiSuccessResponse<Exclude<LoginData, 'accessToken'>>

export interface ResetPasswordRequest {
  userId: string
  password: string
  updatedPassword: string
}
