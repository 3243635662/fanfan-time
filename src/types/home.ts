export interface TabsDataItem {
  key: number;
  title: string;
  tag: string;
}

export interface messageType {
  id: number; // 添加id字段
  backgroundColor: string;
  time: string;
  tag: string;
  content: string;
  likedCount: number;
  commentCount: number;
  username: string;
}

// 添加API响应类型
export interface MessageListResponse {
  code: number;
  message: string;
  data: {
    list: messageType[];
  };
}
