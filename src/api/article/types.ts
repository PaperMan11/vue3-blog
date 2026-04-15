import type { PageRequest, PageResponse } from '@/api/common';

// 文章对象
export interface Article {
  id: number; // 文章ID
  authorId: number; // 作者ID
  authorName: string; // 作者名称
  title: string; // 标题
  summary: string; // 摘要
  content: string; // 内容
  views: number; // 浏览量
  likes: number; // 点赞数
  comments: number; // 评论数
  tags: string[]; // 标签
  cover: string; // 封面
  createdTime: number; // 创建时间
  updatedTime: number; // 更新时间
}

export interface ArticleCategory {
  id: number; // 分类ID
  name: string; // 分类名称
  description: string; // 分类描述
  articles?: Article[]; // 文章列表
  articleCount?: number; // 文章数
}

// 创建文章请求
export interface CreateArticleReq {
  title: string; // 标题
  summary: string; // 摘要
  content: string; // 内容
  tags: string[]; // 标签
  categoryId: number; // 分类ID
  cover: string; // 封面
}

// 创建文章响应
export interface CreateArticleResp {
  id: number; // 文章ID
}

// 列出文章标签请求
export interface ListArticleTagsReq extends PageRequest {
}

// 列出文章标签响应
export interface ListArticleTagsResp extends PageResponse {
  articles: Article[]; // 文章列表
}

// 更新文章请求
export interface UpdateArticleReq {
  id: number; // 文章ID
  title?: string; // 标题
  summary?: string; // 摘要
  content?: string; // 内容
  tags?: string[]; // 标签
  categoryId?: number; // 分类ID
}

// 删除文章请求
export interface DeleteArticleReq {
  id: number; // 文章ID
}

// 根据标签列出文章请求
export interface ListArticleByTagsReq extends PageRequest {
  tag: string; // 标签
}

// 根据标签列出文章响应
export interface ListArticleByTagsResp extends PageResponse {
  articles: Article[]; // 文章列表
}

// 根据分类列出文章请求
export interface ListArticleByCategoryReq extends PageRequest {
  categoryId: number; // 分类ID
}

// 根据分类列出文章响应
export interface ListArticleByCategoryResp extends PageResponse {
  articles: Article[]; // 文章列表
}

export interface ListArticleCategoryReq extends PageRequest {
}

// 列出文章分类响应
export interface ListArticleCategoryResp extends PageResponse {
  categories: ArticleCategory[]; // 文章分类列表
}

export interface CreateArticleCategoryReq {
  name: string; // 分类名称
  description: string; // 分类描述
}

export interface CreateArticleCategoryResp {
  id: number; // 分类ID
}

export interface UpdateArticleCategoryReq {
  id: number; // 分类ID
  name?: string; // 分类名称
  description?: string; // 分类描述
}

export interface DeleteArticleCategoryReq {
  id: number; // 分类ID
}

export const TagTypesArray: Array<'primary' | 'success' | 'info' | 'warning' | 'danger'> = ['primary', 'success', 'info', 'warning', 'danger']
