import request from '@/utils/request';

// 获取未读评论
export function getUnreadComments(data: any) {
  return request({
    url: '/comment/unread',
    method: 'get',
    params: data
  });
}

// 标记评论为已读
export function markCommentAsRead(commentId: number) {
  return request({
    url: `/comment/${commentId}/read`,
    method: 'post'
  });
}

// 获取文章评论
export function getArticleComments(data: any) {
  return request({
    url: '/comment/article',
    method: 'get',
    params: data
  });
}

// 发表评论
export function addComment(data: any) {
  return request({
    url: '/comment/add',
    method: 'post',
    data
  });
}

// 回复评论
export function replyComment(data: any) {
  return request({
    url: '/comment/reply',
    method: 'post',
    data
  });
}

// 删除评论
export function deleteComment(commentId: number) {
  return request({
    url: `/comment/${commentId}`,
    method: 'delete'
  });
}
