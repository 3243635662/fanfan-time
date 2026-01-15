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

