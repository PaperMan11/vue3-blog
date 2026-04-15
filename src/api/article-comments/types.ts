import type { PageRequest, PageResponse } from '@/api/common';
// 评论对象
export interface Comment {
  id: number; // 评论ID
  userId: number; // 用户ID
  userName: string; // 用户名
  userAvatar: string; // 用户头像
  content: string; // 评论内容
  images: string[]; // 图片
  replies?: Reply[]; // 回复列表
  replyCount: number; // 回复数量
  createdAt: number; // 创建时间
}

// 回复对象
export interface Reply {
  id: number; // 回复ID
  userId: number; // 用户ID
  userName: string; // 用户名
  userAvatar: string; // 用户头像
  content: string; // 回复内容
  replyUserId: number; // 回复的用户ID
  replyUserName: string; // 回复的用户名
  replyUserAvatar: string; // 回复的用户头像
  createdAt: number; // 创建时间
}

// 获取文章评论请求
export interface GetArticleCommentsReq extends PageRequest {
  articleId: number; // 文章ID
  targetCommentId?: number; // 目标评论ID，跳转时传参
  tab: 'latest' | 'hot'; // 评论筛选类型：latest-最新，hot-热门
}

// 获取文章评论响应
export interface GetArticleCommentsResp extends PageResponse {
  comments: Comment[]; // 评论列表
}

// 创建文章评论请求
export interface CreateArticleCommentReq {
  articleId: number; // 文章ID
  parentCommentId?: number; // 回复评论的父评论ID
  replyCommentId?: number; // 回复评论ID
  userId: number; // 用户ID
  replyTo: number; // 回复给谁
  content: string; // 评论内容
  imgs: string[]; // 图片
}

// 创建文章评论响应
export interface CreateArticleCommentResp {
  id: number; // 评论ID
}

// 删除文章评论请求
export interface DeleteArticleCommentReq {
  articleId: number; // 文章ID
  commentId: number; // 评论ID
}

export interface GetReplyCommentsReq extends PageRequest {
  articleId: number; // 文章ID
  commentId: number; // 评论ID
}

export interface GetReplyCommentsResp extends PageResponse {
  replies: Reply[]; // 回复列表
}

export interface GetUnreadCommentsReq extends PageRequest {
}

export interface GetUnreadCommentsResp extends PageResponse {
  replies: Reply[]; // 回复列表
}
