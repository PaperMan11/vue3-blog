<template>
  <div class="tag-detail">
    <div class="tag-header">
      <h1>标签：{{ tagInfo.name }}</h1>
      <p class="tag-description">共有 {{ tagInfo.articleCount }} 篇文章</p>
    </div>
    <div class="article-list">
      <el-empty v-if="articles.length === 0" description="暂无文章" />
      <el-card v-for="article in articles" :key="article.id" class="article-card">
        <template #header>
          <div class="article-header-content">
            <el-link :href="`/article/${article.id}/detail`" class="article-title">{{ article.title }}</el-link>
          </div>
        </template>
        <div class="article-meta">
          <span class="article-author">作者：{{ article.author }}</span>
          <span class="article-date">发布时间：{{ article.date }}</span>
          <span class="article-views">阅读：{{ article.views }}</span>
        </div>
        <div class="article-summary">{{ article.summary }}</div>
        <div class="article-tags">
          <el-tag v-for="(tag, index) in article.tags" :key="tag" size="small" effect="light" :type="TagTypesArray[index % TagTypesArray.length]">
            {{ tag }}
          </el-tag>
        </div>
      </el-card>
    </div>
    <!-- 分页 -->
    <div class="pagination" v-if="total > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { TagTypesArray } from '@/api/article/types';

const route = useRoute();
const tagId = computed(() => Number(route.params.id));

// 标签信息
const tagInfo = ref({
  id: 0,
  name: '',
  articleCount: 0
});

// 文章列表
const articles = ref([
  {
    id: 1,
    title: 'Vue 3 入门指南',
    author: 'Vue开发者',
    date: '2026-03-01',
    views: 1234,
    summary: 'Vue 3 是Vue.js的最新版本，带来了许多新特性和改进。本文将带你快速入门Vue 3的核心概念和使用方法。',
    tags: ['Vue3', '前端开发']
  },
  {
    id: 2,
    title: 'Vue 3 Composition API 详解',
    author: 'Vue开发者',
    date: '2026-03-02',
    views: 987,
    summary: 'Composition API是Vue 3的重要特性，本文详细介绍了Composition API的使用方法和最佳实践。',
    tags: ['Vue3', '前端开发', 'Composition API']
  }
]);

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(2);

// 生命周期
onMounted(() => {
  // 实际项目中这里应该调用API获取标签详情和文章列表
  // getTagDetail(tagId.value);
  // getTagArticles(tagId.value, currentPage.value, pageSize.value);

  // 模拟标签详情
  tagInfo.value = {
    id: tagId.value,
    name: tagId.value === 1 ? 'Vue3' : tagId.value === 2 ? 'TypeScript' : tagId.value === 3 ? 'Markdown' : '前端开发',
    articleCount: 2
  };
});

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  // 实际项目中这里应该调用API获取文章列表
  // getTagArticles(tagId.value, currentPage.value, pageSize.value);
};

const handleCurrentChange = (current: number) => {
  currentPage.value = current;
  // 实际项目中这里应该调用API获取文章列表
  // getTagArticles(tagId.value, currentPage.value, pageSize.value);
};
</script>

<style scoped>
.tag-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tag-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.tag-header h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.tag-description {
  color: #999;
  font-size: 14px;
  margin: 0;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-card {
  transition: all 0.3s;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.article-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.article-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.article-meta {
  display: flex;
  gap: 20px;
  margin: 10px 0;
  font-size: 14px;
  color: #999;
  flex-wrap: wrap;
}

.article-summary {
  margin: 10px 0;
  line-height: 1.5;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-tags {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>
