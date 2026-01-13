import request from '@/api/request'
import type { LoginParams, LoginResponse, APIResponse, UserInfo } from '@/types'

// 登录接口
export const loginAPI = (params: LoginParams): Promise<APIResponse<LoginResponse>> => {
  return request.post('auth/login', params)
}

// 获取用户信息接口
export const getUserInfoAPI = (): Promise<APIResponse<UserInfo>> => {
  return request.get('user/info')
}
