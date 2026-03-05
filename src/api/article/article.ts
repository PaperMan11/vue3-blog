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

// 获取文章详情
export function getArticleDetail(id: number) {
  return request({
    url: `/article/detail/${id}`,
    method: 'get'
  });
}
