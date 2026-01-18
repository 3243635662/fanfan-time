import request from '@/api/request'
import type { MessageListResponse, APIResponse, MessageDetailData, LikeResponse } from '@/types'

export const getMessageListAPI = (type: number, page: number = 1, limit: number = 12): Promise<MessageListResponse> => {
  return request.get('fanfan-time-message/getMessageList', { params: { type, page, limit } })
}


export const getMessageDetailByIdAPI = (id: number, page: number = 1): Promise<APIResponse<MessageDetailData>> => {
  return request.get('fanfan-time-message/getMessageDetail', { params: { id, page } })
}

// 新增留言API
export const createMessageAPI = (data: { content: string; tag: number; backgroundColor: string }): Promise<APIResponse<boolean>> => {
  return request.post('fanfan-time-message/create', data)
}

// 新增评论API
export const addCommentAPI = (data: { messageId: number; content: string }): Promise<APIResponse<boolean>> => {
  return request.post('fanfan-time-message/comment', data)
}

// 点赞API
export const likeMessageAPI = (id: number): Promise<APIResponse<LikeResponse>> => {
  return request.post('fanfan-time-message/like', { messageId: id })
}
