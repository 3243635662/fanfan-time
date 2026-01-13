import request from '@/api/request'
import type { MessageListResponse, APIResponse, MessageDetailData } from '@/types'

export const getMessageListAPI = (type: number): Promise<MessageListResponse> => {
  return request.get('fanfan-time-message/getMessageList', { params: { type } })
}


export const getMessageDetailByIdAPI = (id: number): Promise<APIResponse<MessageDetailData>> => {
  return request.get('fanfan-time-message/getMessageDetail', { params: { id } })
}

// 新增留言API
export const createMessageAPI = (data: { content: string; tag: number; backgroundColor: string }): Promise<APIResponse<boolean>> => {
  return request.post('/api/message/create', data)
}
