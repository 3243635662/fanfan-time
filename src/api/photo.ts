import request from '@/api/request'
import type { MediaListResponse } from '@/types'

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

// 获取推荐内容
export const getRecommendPhotoListAPI = (
  page: number = 1,
  limit: number = 20,
  userId?: string
): Promise<MediaListResponse> => {
  return request.get('fanfan-time-message/getRecommendMediaList', {
    params: {
      page,
      limit,
      userId
    }
  })
}

// 点赞/取消点赞
export const likeMediaAPI = (mediaId: number, action: 'like' | 'unlike'): Promise<any> => {
  return request.post(`fanfan-time-message/${action}Media`, { mediaId })
}

// 关注/取消关注
export const followUserAPI = (userId: string, action: 'follow' | 'unfollow'): Promise<any> => {
  return request.post(`fanfan-time-user/${action}`, { userId })
}

// 获取媒体详情
export const getMediaDetailAPI = (mediaId: number): Promise<any> => {
  return request.get(`fanfan-time-message/getMediaDetail/${mediaId}`)
}

// 获取评论列表
export const getMediaCommentsAPI = (mediaId: number, page: number = 1, pageSize: number = 20): Promise<any> => {
  return request.get('fanfan-time-message/getMediaComments', {
    params: { mediaId, page, pageSize }
  })
}

// 添加评论
export const addCommentAPI = (mediaId: number, content: string, parentId?: number): Promise<any> => {
  return request.post('fanfan-time-message/addComment', {
    mediaId,
    content,
    parentId
  })
}
