// res的响应格式
export interface APIResponse<T> {
  code: number;
  message: string;
  result: T;
}

// 分类选项格式
export interface CategoryOption {
  type: number;
  title: string;
  text: string;
}
// 照片分类选项格式
export interface CategoryOptionForPhoto {
  category: number;
  title: string;
  text: string;
}

// 单个留言格式
export interface MessageType {
  id: number;
  backgroundColor: string;
  time: string;
  tag: string;
  content: string;
  likedCount: number;
  commentCount: number;
  username: string;
}

// 留言列表响应
export interface MessageListResponse {
  code: number;
  result: {
    list: any[];
    total: number;
    page: number;
    limit: number;
    type: number;
    totalPage: number;
    links?: {
      first?: string;
      previous?: string;
      next?: string;
      last?: string;
    };
  } | null;
  message: string;
}

// 留言详情数据
export interface MessageDetailData {
  id: number;
  tag: string;
  content: string;
  time: Date;
  likedCount: number;
  commentCount: number;
  username: string;
  backgroundColor: string;
  publisher: {
    id: number;
    username: string;
    avatar: string;
    nickname?: string;
  };
  comments: {
    list: {
      id: number;
      content: string;
      time: Date;
      username: string;
      avatar: string;
      nickname?: string;
    }[];
    totalPage: number;
    total: number;
    page: number;
    limit: number;
  };
}

// 用户信息
export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  email: string;
  roles: any[]
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  tokenStatus: string;
}

// 登录请求参数
export interface LoginParams {
  username: string;
  password: string;
  remember?: boolean; // 记住我
}

// 注册请求参数
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  id: number
  token: string;
  timestamp: Date;
}

// 注册响应
export interface RegisterResponse {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
  roles: any[]
  active: number;
  areaId: number;
  remark: string;
  createdAt: Date;
  updatedAt: Date;
}

// 头像保存响应：
export interface AvatarSaveResponse {
  imgUrl: string
}

// 字体设置选项
export interface FontOption {
  value: string;
  label: string;
  family: string;
}

// 评论列表响应
export interface CommentListResponse {
  list: MessageDetailData['comments']['list'];
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}
// 点赞响应
export interface LikeResponse {
  id: number;
  likedCount: number;
}

// 媒体单个结构
export interface MediaItemType {
  id: number;
  type: number;// 1为图片，2为视频
  category: number; // 分类
  title: string;
  content: string;
  publishTime: Date;
  likedCount: number;
  commentCount: number;
  sharedCount: number;
  viewCount: number;
  videoUrl?: string;
  cover?: string;
  imageUrls?: string[];
  aspectRatio: number; // 宽高比
  publisher: {
    userId: number;
    username: string;
    avatar: string;
    nickname?: string;
  };
}
// 获取媒体列表(分页，关键词，分类筛选)
export interface MediaListResponse {
  code: number;
  result: {
    list: MediaItemType[];
    totalPage: number;
    total: number;
    page: number;
    limit: number;
    filterCategory: number;
    keyword?: string;
    links?: {
      first?: string;
      previous?: string;
      next?: string;
      last?: string;
    };
  } | null;

  message: string;
}

// 媒体详情类型
export interface MediaDetail {
  id: number;
  title: string;
  content: string;
  publishTime: Date;
  type: number;// 1为图片，2为视频
  category: number; // 分类
  videoUrl?: string;
  aspectRatio: number;
  cover?: string;
  likedCount: number;
  commentCount: number;
  sharedCount: number;
  viewCount: number;
  publisher: {
    userId: number;
    username: string;
    avatar: string;
    nickname?: string;
  };
  tags: string[];
  imageUrls?: string[];
  comments: {
    list: {
      id: number;
      content: string;
      publishTime: Date;
      username: string;
      avatar: string;
      nickname?: string;
    }[];
    totalPage: number;
    total: number;
    page: number;
    limit: number;
  };
}

