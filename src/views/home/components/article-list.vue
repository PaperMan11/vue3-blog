<template>
  <div class="article-contanier">
    <div class="article-card" v-for="value, index in articleList" :key="value.id">
      <div class="article-title">{{ value.title }}</div>
      <!-- 文章数据统计 -->
      <div class="article-stats">
        <div class="view">
          <svg-icon icon-class="reading" />
          <span>{{ value.stats.views }}</span>
        </div>
        <div class="like">
          <svg-icon icon-class="like" />
          <span>{{ value.stats.likes }}</span>
        </div>
        <div class="comment">
          <svg-icon icon-class="comments" />
          <span>{{ value.stats.comments }}</span>
        </div>
        <div class="favorite">
          <svg-icon icon-class="collection" />
          <span>{{ value.stats.favorites }}</span>
        </div>
      </div>
      <!-- 摘要 -->
      <div class="summary">{{ value.summary }}</div>
      <!-- 标签 -->
      <div class="tags">
        <el-tag v-for="tag in value.tags" type="primary" :key="tag" size="small">{{ tag }}</el-tag>
      </div>
      <!-- 作者+创建时间+更新时间 -->
      <div class="article-info">
        <span class="author">作者：{{ value.author }}</span>
        <span class="date">发布于 {{ formatTime(value.createdAt, 'YYYY-MM-DD') }}</span>
        <span class="date">更新于 {{ formatTime(value.updatedAt, 'YYYY-MM-DD') }}</span>
      </div>
    </div>
    <!-- 分页组件 完整配置 -->
    <div class="pagination-box">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue' // ✅ 修复：补充缺失的ref引入
import { formatTime } from '@/utils/time';

// ✅ TS类型约束 保持不变
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

const page = ref(1);         // 当前页码
const pageSize = ref(5);     // 每页显示条数
const total = ref(100);      // 总数据条数

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  page.value = 1; // 切换条数时，重置为第一页
  // 这里写：调用文章列表接口，传参 page + pageSize
  console.log('每页条数：', val, '当前页码：', page.value);
};

const handleCurrentChange = (val: number) => {
  page.value = val;
  // 这里写：调用文章列表接口，传参 page + pageSize
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
.article-contanier {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column; // flex垂直单列排列
  gap: 20px; // 卡片之间的间距
  padding: 8px 0;
  margin: 0 auto;
  // max-width: 860px; // 加宽一点，适配分页，阅读更舒适
}

.article-card {
  border-radius: 12px; // 大圆角 柔和风格
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); // 轻量阴影
  padding: 20px 22px;
  box-sizing: border-box;
  * {
    cursor: pointer;
  }
  transition: all 0.25s ease-in-out; // 悬浮过渡动画 丝滑

  // 卡片悬浮微动效
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.12);
  }
}

// 文章标题样式 - 突出显示 视觉核心
.article-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  line-height: 1.5;
  margin-bottom: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; // 超长标题省略
}

// 文章数据统计区 - 阅读/点赞/评论/收藏 横向排列
.article-stats {
  display: flex;
  align-items: center;
  gap: 18px; // 统计项之间的间距
  margin-bottom: 12px;

  // 单个统计项样式
  > div {
    display: flex;
    align-items: center;
    gap: 4px; // 图标与数字间距
    font-size: 13px;
    color: #909399;
  }
}

.summary {
  font-size: 14px;
  color: #606266;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 3; // 最多显示3行
  -webkit-box-orient: vertical;
  overflow: hidden; // 超出3行自动省略
  margin-bottom: 16px;
}

// 文章标签区域样式
.tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap; // 标签过多自动换行
  gap: 8px; // 标签之间的间距
  margin-bottom: 18px;
}

// 文章底部信息区 - 作者+时间
.article-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  padding-top: 10px;
  border-top: 1px solid #f0f2f5; // 顶部分割线 区分内容区

  // 作者文本样式
  .author {
    color: #303133;
    font-weight: 500;
  }

  // 时间文本样式
  .date {
    color: #909399;
  }
}

// 分页区域样式
.pagination-box {
  width: 100%;
  padding: 16px 0 5px;
  box-sizing: border-box;
  text-align: center; // 分页组件水平居中
  // 穿透修改分页组件样式，和全站主题色统一
  :deep(.el-pagination) {
    --el-pagination-active-color: #409eff; // 分页选中主题蓝，和你的全站配色一致
  }
  // 分页背景色美化，和卡片阴影质感匹配
  :deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
    background-color: #409eff;
  }
}
</style>


