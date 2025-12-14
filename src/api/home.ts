import request from '@/api/request'
import type { MessageListResponse } from '@/types/home'

export const getMessageListAPI = (): Promise<MessageListResponse> => { 
  return request.get('/api/message/list')
}