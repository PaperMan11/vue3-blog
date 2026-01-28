<template>
  <div class="article-container">
    <!-- 顶部标签切换栏 -->
    <div class="tab-header">
      <div class="tab-item active">最近</div>
      <div class="tab-item">投票</div>
      <div class="tab-item">热门</div>
    </div>

    <!-- 博客列表主体 -->
    <div class="article-list">
      <div class="article-item" v-for="value, index in articleList" :key="value.id">
        <!-- 作者头像 -->
        <div class="item-left">
          <img src="" alt="作者头像" class="avatar" />
          <span class="blog-type">博客</span>
        </div>

        <!-- 标题（左对齐核心） -->
        <div class="item-middle">
          <h3 class="article-title">{{ value.title }}</h3>
        </div>

        <!-- 右侧数据统计 -->
        <div class="item-right">
          <span class="stat-text">{{ value.stats.views }}</span>
          <span class="divider">/</span>
          <span class="stat-text">{{ value.stats.likes }}</span>
          <span class="divider">/</span>
          <span class="stat-text">{{ value.stats.comments }}</span>
          <span class="divider">|</span>
          <span class="time-text">{{ formatTime(value.createdAt, 'YYYY-MM-DD') }}</span>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        layout="prev, pager, next, jumper"
        background
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
const pageSize = ref(10);
const total = ref(4028);

const handleCurrentChange = (val: number) => {
  page.value = val;
  console.log('当前页码：', val);
};

// 文章列表数据
const articleList: ArticleItem[] = [
  { id: 1, title: '《多课网》企业级前端项目实战教程（Next.js + TS + AntD）', summary: '', tags: [], author: '作者A', createdAt: 1768805022, updatedAt: 1768805022, stats: { views: 23, likes: 56, comments: 55, favorites: 0 } },
  { id: 2, title: 'Golang 遥控器Context', summary: '', tags: [], author: '作者A', createdAt: 1768794022, updatedAt: 1768794022, stats: { views: 34, likes: 0, comments: 0, favorites: 0 } },
  { id: 3, title: '分享一个我自己在用TTS，好用就算了，它还是免费的！', summary: '', tags: [], author: '作者A', createdAt: 1768783022, updatedAt: 1768783022, stats: { views: 25, likes: 0, comments: 0, favorites: 0 } },
  { id: 4, title: 'Golang 常用数据结构详解（偏工程 & 底层）', summary: '', tags: [], author: '作者A', createdAt: 1768773022, updatedAt: 1768773022, stats: { views: 34, likes: 2, comments: 3, favorites: 0 } },
  { id: 5, title: 'go系统调用阻塞的处理', summary: '', tags: [], author: '作者A', createdAt: 1768763022, updatedAt: 1768763022, stats: { views: 51, likes: 44, comments: 33, favorites: 0 } },
];
</script>

<style scoped lang="scss">
.article-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
}

// 顶部标签栏
.tab-header {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f2f5;

  .tab-item {
    font-size: 16px;
    color: #606266;
    cursor: pointer;
    padding: 4px 0;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;

    &.active {
      color: #409eff;
      border-bottom-color: #409eff;
      font-weight: 500;
    }

    &:hover {
      color: #409eff;
    }
  }
}

// 文章列表
.article-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

// 列表项
.article-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f5;
  transition: background 0.2s;

  &:hover {
    background: #fafbfc;
  }

  // 左侧头像（固定宽度，保证标题左对齐整齐）
  .item-left {
    display: flex;
    align-items: center;
    flex-shrink: 0; // 固定宽度不压缩
    gap: 2px;

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }

    .blog-type {
      font-size: 12px;
      background: #ecf5ff;
      color: #409eff;
      padding: 2px 6px;
      border-radius: 2px;
    }
  }

  // 中间标题
  .item-middle {
    flex: 1;
    min-width: 0;
    text-align: left; // 强制左对齐
    * {
      cursor: pointer;
    }

    .article-title {
      font-size: 15px;
      color: #303133;
      line-height: 1.5;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left; // 标题本身左对齐
      transition: color 0.2s;

      &:hover {
        color: #409eff;
      }
    }
  }

  // 右侧数据+时间
  .item-right {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #909399;
    flex-shrink: 0; // 固定宽度不压缩

    .stat-text {
      color: #409eff;
    }

    .divider {
      color: #e6e8eb;
    }

    .time-text {
      color: #c0c4cc;
    }
  }
}

// 分页
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  // .pagination {
  //   --el-pagination-active-color: #409eff;

  //   :deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
  //     background-color: #409eff;
  //   }
  // }
}
</style>
