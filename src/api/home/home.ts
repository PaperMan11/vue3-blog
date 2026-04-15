import request from '@/utils/request';
import type {
  HomeArticleReq,
  HomeArticleResp,
  Notice,
  ArticleStats
} from './types';
import type { Article } from '@/api/article/types';
import type { PageRequest } from '@/api/common';

// 首页文章列表
export function listHomeArticle(data: HomeArticleReq) {
  return request<HomeArticleResp>({
    url: '/blog/home/articles',
    method: 'get',
    params: data
  });
}

// 文章推荐
export function listRecommendArticle(data: PageRequest) {
  return request<Article[]>({
    url: '/blog/home/recommend',
    method: 'get',
    params: data
  });
}

// 获取公告
export function getNotice() {
  return request<Notice>({
    url: '/blog/home/notice',
    method: 'get'
  });
}

// 获取文章统计
export function getArticleStats() {
  return request<ArticleStats>({
    url: '/blog/home/stats',
    method: 'get'
  });
}
