import request from '@/api/request'
import type { APIResponse, CreateMediaDto, LikeMediaResponse, MediaCommentsDto, MediaCommentsResponse, MediaDetail, MediaItemType, MediaListResponse, QiNiuTokenResponse, ShareMediaResponse, ViewMediaResponse } from '@/types'

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

// 新增图片
export const createImagesAPI = (data: CreateMediaDto): Promise<APIResponse<MediaItemType>> => {
  return request.post('fanfan-time-message/createImages', data)
}

// 获取七牛上传token
export const getQiNiuTokenAPI = (data: { key?: string }): Promise<APIResponse<QiNiuTokenResponse>> => {
  return request.post('fanfan-time-message/getQiNiuToken', data)
}
// 新增视频
export const createVideoAPI = (data: CreateMediaDto): Promise<APIResponse<MediaItemType>> => {
  return request.post('fanfan-time-message/createVideo', data)
}

// 提交媒体评论
export const createMediaCommentsAPI = (data: MediaCommentsDto): Promise<APIResponse<MediaCommentsResponse>> => {
  return request.post('fanfan-time-message/commentMedia', data)
}

// 媒体点赞
export const likeMediaAPI = (data: { mediaId: number }): Promise<APIResponse<LikeMediaResponse>> => {
  return request.post('fanfan-time-message/likeMedia', data)
}
// 分享
export const shareMediaAPI = (data: { mediaId: number }): Promise<APIResponse<ShareMediaResponse>> => {
  return request.post('fanfan-time-message/shareMedia', data)
}

// 浏览
export const viewMediaAPI = (data: { mediaId: number }): Promise<APIResponse<ViewMediaResponse>> => {
  return request.post('fanfan-time-message/viewMedia', data)
}
