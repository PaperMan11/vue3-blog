import request from '@/utils/request';

// 创建文章
export function createArticle(data: any) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  });
}

// 修改文章
export function updateArticle(data: any) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  });
}

// 根据ID获取文章
export function getArticleById(id: number) {
  return request({
    url: `/article/${id}`,
    method: 'get'
  });
}

// 获取文章列表
export function getArticleList(params: any) {
  return request({
    url: '/article/list',
    method: 'get',
    params
  });
}

// 获取用户文章时间线
export function getArticleTimeline() {
  return request({
    url: '/article/timeline',
    method: 'get'
  });
}

// 获取文章评论(分页)
// params: articleId, pageNum, pageSize, sortType, targetCommentId(可选)
// sortType: 1-按创建时间排序, 2-按点赞数排序
// targetCommentId: 目标评论ID, 用于展开包含该评论的父评论(可选)
export function getArticleComments(data: any) {
  return request({
    url: `/article/comment`,
    method: 'post',
    data
  });
}
