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
// 留言的响应
export interface MessageListAPIResponse<T> {
  code: number;
  message: string;
  data: {"list":T};
}


// 单个详情的格式
export interface MessageDetailResponse {
    id: number;
    content: string;
    time: string;
    likedCount: number;
    commentCount: number;
    username: string;
    tag: string;
    comments: {
      username: string;
      time: string;
      text: string;
      avatar: string;
    }[];
}

