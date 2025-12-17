import request from '@/api/request'
import type { MessageListAPIResponse, APIResponse, MessageType, MessageDetailResponse } from '@/types'

export const getMessageListAPI = (): Promise<MessageListAPIResponse<MessageType[]>> => {
  return request.get('/api/message/list')
}

export const getMessageDetailByIdAPI = (id: number): Promise<APIResponse<MessageDetailResponse>> => {
  return request.post('/api/message/detail', { id })
}

// 新增留言API
export const createMessageAPI = (data: { content: string; tag: number; backgroundColor: string }): Promise<APIResponse<boolean>> => {
  return request.post('/api/message/create', data)
}
