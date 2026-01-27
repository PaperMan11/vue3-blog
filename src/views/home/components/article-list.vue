<template>
  <div class="article-container">
    <!-- 博客列表主体 -->
    <div class="article-list">
      <div class="article-card" v-for="value, index in articleList" :key="value.id">
        <!-- 头部：标题 + 核心数据 -->
        <div class="card-header">
          <h3 class="article-title">{{ value.title }}</h3>
          <div class="article-stats">
            <div class="stat-item">
              <svg-icon icon-class="reading" class="stat-icon" />
              <span class="stat-text">{{ value.stats.views }}</span>
            </div>
            <div class="stat-item">
              <svg-icon icon-class="like" class="stat-icon" />
              <span class="stat-text">{{ value.stats.likes }}</span>
            </div>
            <div class="stat-item">
              <svg-icon icon-class="comments" class="stat-icon" />
              <span class="stat-text">{{ value.stats.comments }}</span>
            </div>
            <div class="stat-item">
              <svg-icon icon-class="collection" class="stat-icon" />
              <span class="stat-text">{{ value.stats.favorites }}</span>
            </div>
          </div>
        </div>

        <!-- 中部：摘要 -->
        <div class="card-body">
          <p class="summary">{{ value.summary }}</p>
        </div>

        <!-- 底部：标签 + 作者/时间（辅助信息） -->
        <div class="card-footer">
          <div class="tags">
            <el-tag 
              v-for="tag in value.tags" 
              :key="tag" 
              type="primary" 
              size="small"
              class="tag-item"
            >{{ tag }}</el-tag>
          </div>
          <div class="article-meta">
            <span class="author">@{{ value.author }}</span>
            <span class="divider">·</span>
            <span class="date">发布于 {{ formatTime(value.createdAt, 'YYYY-MM-DD') }}</span>
            <span class="divider">·</span>
            <span class="date updated">最后更新 {{ formatTime(value.updatedAt, 'YYYY-MM-DD') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatTime } from '@/utils/time';

interface ArticleStats {
  views: number;
  likes: number;
  comments: number;
  favorites: number;
}
interface ArticleItem {
  id: number;
  title: string;
  summary: string;
  tags: string[];
  author: string;
  createdAt: number;
  updatedAt: number;
  stats: ArticleStats;
}

// 分页相关
const page = ref(1);
const pageSize = ref(5);
const total = ref(100);

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  page.value = 1;
  console.log('每页条数：', val, '当前页码：', page.value);
};

const handleCurrentChange = (val: number) => {
  page.value = val;
  console.log('当前页码：', val);
};

// 文章列表数据
const articleList: ArticleItem[] = [
  { id: 1, title: 'Vue 3 新特性介绍', summary: 'Vue 3 新特性介绍，组合式API、响应式原理更新、性能优化等核心亮点讲解，让你的Vue开发效率翻倍。', tags: ['vue3', 'router'], author: '作者A', createdAt: 1768805022, updatedAt: 1768805022, stats: { views: 1200, likes: 300, comments: 100, favorites: 99 } },
  { id: 2, title: '如何使用 TypeScript 提升代码质量', summary: '如何使用 TypeScript 提升代码质量，强类型约束、接口定义、泛型使用，告别JS的类型模糊问题，写出健壮的前端代码。', tags: ['typescript', 'code'], author: '作者B', createdAt: 1768794022, updatedAt: 1768794022, stats: { views: 1500, likes: 400, comments: 150, favorites: 120 } },
  { id: 3, title: '前端性能优化最佳实践', summary: '前端性能优化最佳实践，懒加载、资源压缩、缓存策略、首屏加载优化、减少重排重绘，从0到1打造高性能前端应用。前端性能优化最佳实践，懒加载、资源压缩、缓存策略、首屏加载优化、减少重排重绘，从0到1打造高性能前端应用。前端性能优化最佳实践，懒加载、资源压缩、缓存策略、首屏加载优化、减少重排重绘，从0到1打造高性能前端应用。', tags: ['performance', 'optimization'], author: '作者C', createdAt: 1768783022, updatedAt: 1768783022, stats: { views: 1800, likes: 500, comments: 200, favorites: 150 } },
  { id: 4, title: '响应式编程入门指南', summary: '响应式编程入门指南，理解响应式思想、Vue响应式原理、RxJS基础使用，让你的代码更优雅、更易维护。', tags: ['reactive', 'programming'], author: '作者D', createdAt: 1768773022, updatedAt: 1768773022, stats: { views: 2000, likes: 600, comments: 250, favorites: 180 } },
  { id: 5, title: '构建高可用的前端应用', summary: '构建高可用的前端应用，错误处理、兜底方案、兼容性适配、自动化测试、监控告警，打造生产级别的前端项目。', tags: ['high-availability', 'frontend'], author: '作者E', createdAt: 1768763022, updatedAt: 1768763022, stats: { views: 2200, likes: 700, comments: 300, favorites: 200 } },
];
</script>

<style scoped lang="scss">
.article-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
  box-sizing: border-box;
}

// 文章列表：网格布局+呼吸感间距
.article-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px; // 卡片间距
  margin-bottom: 40px; // 与分页保持足够间距
}

.article-card {
  background: #fff;
  border-radius: 16px; // 大圆角
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
  padding: 28px 32px;
  box-sizing: border-box;
  transition: all 0.3s ease;
  cursor: pointer;

  // 悬浮动效：轻微上浮+阴影加深
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  // 内部模块化分区：header/body/footer 清晰分离
  .card-header {
    margin-bottom: 20px;

    .article-title {
      font-size: 20px;
      font-weight: 700;
      color: #1d2129;
      line-height: 1.4;
      margin: 0 0 12px 0;
      transition: color 0.2s ease;

      &:hover {
        color: #409eff; // 悬浮变色，引导点击
      }
    }

    .article-stats {
      display: flex;
      align-items: center;
      gap: 20px;
      color: #86909c;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;

        .stat-icon {
          width: 16px;
          height: 16px;
        }

        .stat-text {
          &:hover {
            color: #409eff;
          }
        }
      }
    }
  }

  // 摘要
  .card-body {
    margin-bottom: 24px;

    .summary {
      font-size: 15px;
      color: #4e5969;
      line-height: 1.8;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  // 底部
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    padding-top: 20px;
    border-top: 1px solid #f2f3f5;

    .tags {
      display: flex;
      gap: 8px;

      .tag-item {
        background: #f0f7ff;
        color: #409eff;
        border: none;
        border-radius: 4px;
        padding: 2px 8px;

        &:hover {
          background: #409eff;
          color: #fff;
        }
      }
    }

    // 元信息
    .article-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #86909c;

      .author {
        color: #1d2129;
        font-weight: 500;

        &:hover {
          color: #409eff;
        }
      }

      .divider {
        color: #c9cdD4;
      }

      .updated {
        color: #9da3ad;
        font-size: 13px;
      }
    }
  }
}

// 分页
.pagination-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;

  .pagination {
    --el-pagination-active-color: #409eff;

    :deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
      background-color: #409eff;
    }

    :deep(.el-pagination__total) {
      color: #86909c;
    }
  }
}
</style>
