import request from '@/utils/request';
import type {
  GetArticleCommentsReq,
  GetArticleCommentsResp,
  CreateArticleCommentReq,
  CreateArticleCommentResp,
  DeleteArticleCommentReq,
  GetReplyCommentsReq,
  GetReplyCommentsResp,
  GetUnreadCommentsReq,
  GetUnreadCommentsResp
} from './types';

// 获取文章评论
export function getArticleComments(data: GetArticleCommentsReq) {
  return request<GetArticleCommentsResp>({
    url: '/blog/article/comments',
    method: 'get',
    params: data
  });
}

// 创建文章评论
export function createArticleComment(data: CreateArticleCommentReq) {
  return request<CreateArticleCommentResp>({
    url: '/blog/article/comments',
    method: 'post',
    data
  });
}

// 删除文章评论
export function deleteArticleComment(data: DeleteArticleCommentReq) {
  return request<void>({
    url: '/blog/article/comments',
    method: 'delete',
    data
  });
}

export function getReplyComments(data: GetReplyCommentsReq) {
  return request<GetReplyCommentsResp>({
    url: '/blog/article/comments/reply',
    method: 'get',
    params: data
  });
}

export function getUnreadComments(data: GetUnreadCommentsReq) {
  return request<GetUnreadCommentsResp>({
    url: '/blog/article/comments/unread',
    method: 'get',
    params: data
  });
}
