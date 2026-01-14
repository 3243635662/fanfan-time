import request from '@/api/request'
import type { LoginParams, LoginResponse, APIResponse, UserInfo, RegisterData, RegisterResponse } from '@/types'

// 登录接口
export const loginAPI = (params: LoginParams): Promise<APIResponse<LoginResponse>> => {
  return request.post('auth/login', params)
}

// 获取用户信息接口
export const getUserInfoAPI = (): Promise<APIResponse<UserInfo>> => {
  return request.get('user/info')
}

// 注册接口
export const registerAPI=(data:RegisterData): Promise<APIResponse<RegisterResponse>> => {
  return request.post('user', data)
}
