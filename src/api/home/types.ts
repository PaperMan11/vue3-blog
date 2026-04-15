import type { PageRequest, PageResponse } from '@/api/common';
import type { Article } from '@/api/article/types';

// 公告
export interface Notice {
  id: number; // 公告ID
  content: string; // 公告内容
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
}

// 首页文章请求
export interface HomeArticleReq extends PageRequest {
  tab: 'recent' | 'vote' | 'hot'; // 标签页：recent-最新，vote-推荐，hot-热门
}

// 首页文章响应
export interface HomeArticleResp extends PageResponse {
  articles: Article[]; // 文章列表
}

// 文章统计
export interface ArticleStats {
  articleNum: number; // 文章数
  categoryNum: number; // 分类数
  commentNum: number; // 评论数
}
