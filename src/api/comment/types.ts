// 评论类型
export interface Comment {
  id: number;
  articleId: number;
  articleTitle: string;
  userId: number;
  username: string;
  avatar: string;
  content: string;
  parentId: number | null;
  replyTo: string | null;
  createTime: string;
  isRead: boolean;
}

// 评论列表响应
export interface CommentListResponse {
  comments: Comment[];
  total: number;
  page: number;
  pageSize: number;
}

// 评论请求参数
export interface CommentRequest {
  articleId: number;
  page?: number;
  pageSize?: number;
}

// 未读评论请求参数
export interface UnreadCommentRequest {
  userId: number;
  page?: number;
  pageSize?: number;
}

// 发表评论请求参数
export interface AddCommentRequest {
  articleId: number;
  content: string;
  parentId?: number;
  replyTo?: string;
}
