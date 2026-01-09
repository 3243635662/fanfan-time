// res的响应格式
export interface APIResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 单个Tabs格式
export interface TabsDataItem {
  key: number;
  title: string;
  tag: string;
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
// 获取留言的响应
export interface MessageListAPIResponse<T> {
  code: number;
  message: string;
  result: {
    list: T,
    total: number,
    page: number,
    limit: number,
    type: number;
    links:string[]
  };
}


// 单个详情的格式
export interface MessageDetailResponse {
  id?: number;
  avatar?: string,
  backgroundColor?: string;
  content?: string;
  time?: string;
  likedCount?: number;
  commentCount?: number;
  username?: string;
  tag?: string;
  comments?: {
    username: string;
    time: string;
    text: string;
    avatar: string;
  }[];
}

// 用户信息
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

// 登录请求参数
export interface LoginParams {
  username: string;
  password: string;
}

// 注册请求参数
export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// 登录响应
export interface LoginResponse {
  token: string;
  user: UserInfo;
}

// 注册响应
export interface RegisterResponse {
  message: string;
  user?: UserInfo;
}

// 字体设置选项
export interface FontOption {
  value: string;
  label: string;
  family: string;
}
