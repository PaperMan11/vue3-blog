import request from '@/utils/request';
import type {
  Article,
  ArticleCategory,
  CreateArticleReq,
  CreateArticleResp,
  UpdateArticleReq,
  DeleteArticleReq,
  ListArticleCategoryReq,
  ListArticleCategoryResp,
  ListArticleTagsReq,
  ListArticleTagsResp,
  ListArticleByTagsReq,
  ListArticleByTagsResp,
  ListArticleByCategoryReq,
  ListArticleByCategoryResp,
  CreateArticleCategoryReq,
  CreateArticleCategoryResp,
  UpdateArticleCategoryReq,
  DeleteArticleCategoryReq
} from './types';

// 获取文章详情
export function getArticle(id: number) {
  return request<Article>({
    url: `/blog/article/${id}`,
    method: 'get'
  });
}

// 创建文章
export function createArticle(data: CreateArticleReq) {
  return request<CreateArticleResp>({
    url: '/blog/article',
    method: 'post',
    data
  });
}

// 更新文章
export function updateArticle(data: UpdateArticleReq) {
  return request<Article>({
    url: '/blog/article',
    method: 'put',
    data
  });
}

// 删除文章
export function deleteArticle(data: DeleteArticleReq) {
  return request<void>({
    url: '/blog/article',
    method: 'delete',
    data
  });
}

export function listArticleCategories(data: ListArticleCategoryReq) {
  return request<ListArticleCategoryResp>({
    url: '/blog/article/category',
    method: 'get',
    params: data
  });
}

// 列出文章标签
export function listArticleTags(data: ListArticleTagsReq) {
  return request<ListArticleTagsResp>({
    url: '/blog/article/tags',
    method: 'get',
    data
  });
}

// 根据标签列出文章
export function listArticleByTags(data: ListArticleByTagsReq) {
  return request<ListArticleByTagsResp>({
    url: '/blog/article/tags/article',
    method: 'get',
    data
  });
}

export function getArticleByCategory(categoryId: number) {
  return request<ArticleCategory>({
    url: `/blog/article/category/${categoryId}/articles`,
    method: 'get'
  });
}

// 根据分类列出文章
export function listArticleByCategory(data: ListArticleByCategoryReq) {
  return request<ListArticleByCategoryResp>({
    url: '/blog/article/category/articles',
    method: 'get',
    params: data
  });
}

// 获取用户文章时间线
export function getArticleTimeline() {
  return request<Article[]>({
    url: `/blog/user/article/timeline`,
    method: 'get'
  });
}

export function createArticleCategory(data: CreateArticleCategoryReq) {
  return request<CreateArticleCategoryResp>({
    url: '/blog/article/category',
    method: 'post',
    data
  });
}

export function updateArticleCategory(data: UpdateArticleCategoryReq) {
  return request<void>({
    url: '/blog/article/category',
    method: 'put',
    data
  });
}

export function deleteArticleCategory(data: DeleteArticleCategoryReq) {
  return request<void>({
    url: '/blog/article/category',
    method: 'delete',
    data
  });
}

export function getAllArticleCategories() {
  return request<ArticleCategory[]>({
    url: '/blog/article/category/categories/all',
    method: 'get'
  });
}
