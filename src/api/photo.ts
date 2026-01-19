import request from '@/api/request'
import type { MediaListResponse } from '@/types'

export const getPhotoListAPI = (page: number = 1, filterCategory: number = 0, keyword: string = '', type: number = 1,): Promise<MediaListResponse> => {
  return request.get('fanfan-time-message/getMediaList', { params: { page, filterCategory, keyword, type } })
}
