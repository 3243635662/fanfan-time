import request from '@/api/request'
import type { LoginParams, LoginResponse, APIResponse, UserInfo, RegisterData, RegisterResponse, AvatarSaveResponse, CloudflareTurnstileResponse, SendEmailCodeResponse } from '@/types'

// 登录接口
export const loginAPI = (params: LoginParams): Promise<APIResponse<LoginResponse>> => {
  return request.post('auth/login', params)
}

// 获取用户信息接口
export const getUserInfoAPI = (): Promise<APIResponse<UserInfo>> => {
  return request.get('user/info')
}

// 注册接口
export const registerAPI = (data: RegisterData): Promise<APIResponse<RegisterResponse>> => {
  return request.post('user', data)
}

// 保存图床图片的路径
export const saveImageHostingUrlAPI: (imgUrl: string) => Promise<APIResponse<AvatarSaveResponse>> = (imgUrl: string) => {
  return request.post('user/imgHost', { imgUrl })
}

// Cloudflare turnstile 验证集成
export const verifyTurnstileTokenAPI = (token: string): Promise<APIResponse<CloudflareTurnstileResponse>> => {
  return request.post('user/verifyTurnstileToken', { token })
}

//  发送邮箱验证码
export const sendEmailCodeAPI = (email: string): Promise<APIResponse<SendEmailCodeResponse>> => {
  return request.post('user/sendRegisterCode', { email })
}
