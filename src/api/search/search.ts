import request from '@/utils/request';
import type { PageRequest, PageResponse } from '@/api/common';
import type { Article } from '@/api/article/types';

// 搜索请求参数
export interface SearchReq extends PageRequest {
  type?: 'all' | 'article' | 'tag';
}

// 搜索响应
export interface SearchResp extends PageResponse {
  results: Article[];
}

// 搜索联想请求
export interface SearchSuggestReq {
  keyword: string;
  limit?: number;
}

// 搜索联想响应
export interface SearchSuggestResp {
  keywords: string[];
}

// 热门搜索响应
export interface HotSearchResp {
  keywords: string[];
}

// 搜索文章/标签/分类
export function search(data: SearchReq) {
  return request<SearchResp>({
    url: '/blog/home/search',
    method: 'get',
    params: data
  });
}

// 搜索联想
export function searchSuggest(data: SearchSuggestReq) {
  return request<SearchSuggestResp>({
    url: '/blog/home/search/suggest',
    method: 'post',
    data
  });
}

// 获取热门搜索
export function getHotSearch() {
  return request<HotSearchResp>({
    url: '/blog/home/search/hot',
    method: 'get'
  });
}
