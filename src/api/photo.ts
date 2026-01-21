import request from '@/api/request'
import type { APIResponse, MediaDetail, MediaListResponse } from '@/types'

export const getPhotoListAPI = (
  page: number = 1,
  filterCategory: number = 0,
  keyword: string = '',
  type: number = 1,
  pageSize: number = 20,
  sortBy: string = 'created_at',
  sortOrder: string = 'desc'
): Promise<MediaListResponse> => {
  return request.get('fanfan-time-message/getMediaList', {
    params: {
      page,
      filterCategory,
      keyword,
      type,
      pageSize,
      sortBy,
      sortOrder
    }
  })
}

export const getMediaDetailAPI = (id: number, page: number): Promise<APIResponse<MediaDetail>> => {
  return request.get('fanfan-time-message/getMediaDetail', {
    params: { id, page }
  })
}

